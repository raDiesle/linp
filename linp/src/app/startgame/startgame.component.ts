import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Router} from '@angular/router';
import {Game, GamePlayer, PointsScored} from '../models/game';
import * as firebase from 'firebase/app';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-startgame',
  templateUrl: './startgame.component.html',
  styleUrls: ['./startgame.component.css']
})
export class StartgameComponent implements OnInit, OnDestroy {

  gameFilter = '';
  hasAnyFilterHitted = true;
  games: any = [];
  selectedGame: Game;

// @Input

  playerName: string;

  private authUser: firebase.User;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFireDatabase,
              public router: Router) {

    this.db.list('/games')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(games => {
        this.games = games;
      });

    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;

        const uid = authUser.uid;
        this.db.object('/players/' + uid)
          .takeUntil(this.ngUnsubscribe)
          .subscribe(playerProfile => {
            this.playerName = playerProfile.name;
          });
      });
  }

  ngOnInit() {
  }

  resetFilterResults() {
    this.hasAnyFilterHitted = false;
  }

  onSelectGameToJoin(game: Game): void {
    this.selectedGame = game;

    // TODO extract to model
    const updatePlayer = {};
    updatePlayer[this.authUser.uid] = <GamePlayer>{
      uid: this.authUser.uid,
      name: this.playerName,
      status: 'JOINED',
// substract to initial model object
    };

    this.db.object('games/' + game.name + '/players')
      .update(updatePlayer); // should be set
    this.router.navigate(['/gamelobby', game.name]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
