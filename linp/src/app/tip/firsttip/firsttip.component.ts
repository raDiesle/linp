import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GamePlayer, GameStatus} from '../../models/game';
import {Subject} from 'rxjs/Subject';


@Component({
  selector: 'app-firsttip',
  templateUrl: './firsttip.component.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit, OnDestroy {
  loggedInGamePlayer: GamePlayer;

  statusToCheck: GameStatus = 'FIRST_WORD_GIVEN';

  gamePlayerKeys: string[];
  authUser: firebase.User;
  gamePlayers: GamePlayer[];
  gameName: string;
  // @input
  private synonym: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private currentPlayer: GamePlayer;
  public show$: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth) {
    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
      });
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');


    Observable.timer(0, 1000).subscribe(number => {
      this.show$ = number % 2 === 0;
    });

    // might be done functional, might be separate view with redirect
    // might be async issue, put into callback


    this.db.collection<GamePlayer>('/games/' + this.gameName + '/players')
      .valueChanges()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;

        // rewrite
        this.gamePlayers.forEach(gamePlayer => {
          if (gamePlayer.uid === this.authUser.uid) {
            this.loggedInGamePlayer = gamePlayer;
          }
        });

// guarantee position missing
        this.gamePlayers.forEach(gamePlayer => {
          const isCurrentPlayerIdentified = gamePlayer.status !== this.statusToCheck;
          if (isCurrentPlayerIdentified) {
            this.currentPlayer = gamePlayer;
          }
          return isCurrentPlayerIdentified;
        });
        // just make foreach
        this.observeGamePlayerStatus(gamePlayers);
      });
  }

  sendSynonym() {
    const gamePlayerUpdate = {
      status: 'FIRST_WORD_GIVEN',
      firstSynonym: this.synonym
    };
    this.db.doc('games/' + this.gameName + '/players/' + this.authUser.uid)
      .update(gamePlayerUpdate)
      .then(gamePlayerModel => console.log('Successful saved'));
  }

  private observeGamePlayerStatus(gamePlayers: GamePlayer[]) {
    const nextPositiveRoute = '/firstguess';

    return Observable.pairs(gamePlayers)
      .flatMap(p => Observable.of(p))
      .pluck('status')
      .every(status => status === this.statusToCheck)
      .toPromise()
      .then(allGivenFirstSynonym => {
        if (allGivenFirstSynonym) {
          this.router.navigate([nextPositiveRoute, this.gameName]);
        }
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
