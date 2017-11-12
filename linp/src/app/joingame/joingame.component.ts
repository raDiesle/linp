import {ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Router} from '@angular/router';
import {Game, GamePlayer, PointsScored} from '../models/game';
import * as firebase from 'firebase/app';
import {Subject} from 'rxjs/Subject';

import {
  trigger,
  state,
  style,
  animate,
  transition,
  group
} from '@angular/animations';
import {Observable} from 'rxjs/Observable';
import {fadeInAnimation} from 'app/widgets/animations';
import {growShrinkStaticStart} from '../animations/growShrinkStaticStart';


@Component({
  selector: 'app-joingame',
  templateUrl: './joingame.component.html',
  styleUrls: ['./joingame.component.css'],
  animations: [fadeInAnimation, growShrinkStaticStart]
})
export class JoinGameComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;
  @HostBinding('style.display') display = 'block';

  gameFilter = '';
  hasAnyFilterHitted = true;
  games: any = [];
  selectedGame: Game;
  private animationInitialized = false;
// @Input

  playerName: string;

  private authUser: firebase.User;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFireDatabase,
              public router: Router,
              private changeDetectorRef: ChangeDetectorRef) {

    this.db.list('/games')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(games => {


        const games$ = Observable.from(games);
        const timer$ = Observable.timer(0, 250);
        const gamesOverTime$ = Observable.zip(games$, timer$, (item, i) => item);
        // for animation
        gamesOverTime$.subscribe((res) => this.games.push(res));
      });

    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
// https://gist.github.com/JamieMason/303c5fc90b28c28a804e3f7ea9ab01f1
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
      status: 'GAME_LOBBY',
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
