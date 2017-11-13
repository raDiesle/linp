import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import {Game, GamePlayer} from '../models/game';
import * as firebase from 'firebase/app';
import {Subject} from 'rxjs/Subject';
import {Router} from '@angular/router';

@Component({
  selector: 'app-creategame',
  templateUrl: './creategame.component.html',
  styleUrls: ['./creategame.component.css']
})
export class CreategameComponent implements OnInit, OnDestroy {

  gameName = '';
  private authUser: firebase.User;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private playerName: string;

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFirestore,
              public router: Router) {
    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;

        const uid = authUser.uid;
        this.db.doc<GamePlayer>('/players/' + uid)
          .valueChanges()
          .takeUntil(this.ngUnsubscribe)
          .subscribe(playerProfile => {
            this.gameName = playerProfile.name;
            this.playerName = playerProfile.name;
          });
      });
  }

  ngOnInit() {
  }

  // To be extracted to service
  createGameAction(): void {
    const playerName = this.playerName;
    const gameName = this.gameName;

    // extract to model
    const request: Game = {
      name: gameName,
      host: this.authUser.uid,
      status: 'PREPARE_GAME',
// create collection
      players: [],
      round: 0
    };

    // extract to model
    request.players[this.authUser.uid] = {
      uid: this.authUser.uid,
      name: playerName,
      status: 'GAME_LOBBY'
    };

    this.db.doc<Game>('games/' + gameName)
      .set(<Game>request);

    this.router.navigate(['/gamelobby', gameName]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
