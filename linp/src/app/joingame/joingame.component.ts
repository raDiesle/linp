import {ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
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
import {PlayerProfile} from 'app/models/player';


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
              public db: AngularFirestore,
              public router: Router,
              private changeDetectorRef: ChangeDetectorRef) {

    // <{[uid: string]: Game}>
    this.db.collection('/games')
      .valueChanges()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(games => {
        const games$ = Observable.from(games);
        const timer$ = Observable.timer(0, 200);
        const gamesOverTime$ = Observable.zip(games$, timer$, (item, i) => item);
        // for animation
        gamesOverTime$.subscribe((res) => this.games.push(res));
      });

  }

  ngOnInit() {
  }

  resetFilterResults() {
    this.hasAnyFilterHitted = false;
  }

  onSelectGameToJoin(game: Game): void {
    this.selectedGame = game;
    this.router.navigate(['/gamelobby', game.name]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
