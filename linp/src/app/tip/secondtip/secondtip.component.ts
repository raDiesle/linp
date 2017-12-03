import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GamePlayer, GameStatus} from '../../models/game';
import {Subject} from 'rxjs/Subject';

const GAME_STATUS = 'SECOND_SYNONYM_GIVEN';

@Component({
  selector: 'app-secondtip',
  templateUrl: './secondtip.component.html',
  styleUrls: ['./secondtip.component.css']
})
export class SecondtipComponent implements OnInit, OnDestroy {
  loggedInGamePlayer: GamePlayer;
  gamePlayerKeys: string[];
  authUser: firebase.User;
  gamePlayers: GamePlayer[];
  gameName: string;
  // @input
  private synonym: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

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

    const nextPositiveRoute = '/secondguess';
    this.db
      .collection('games')
      .doc(this.gameName)
      .collection<GamePlayer>('players')
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
        this.observeGamePlayerStatus(gamePlayers, GAME_STATUS, nextPositiveRoute);
      });
  }

  sendSynonym() {
    const requestGamePlayerModel = {
      status: GAME_STATUS,
      secondSynonym: this.synonym
    };
    this.db.collection('games')
      .doc(this.gameName)
      .collection('players')
      .doc(this.authUser.uid)
      .update(requestGamePlayerModel)
      .then(gamePlayerModel => {
          alert('Successful saved');
        }
      );
  }

  private observeGamePlayerStatus(gamePlayers: GamePlayer[], statusToCheck: string, nextPositiveRoute: string) {
    Observable.pairs(gamePlayers)
      .flatMap(p => Observable.of(p))
      .pluck('status')
      .every(status => status === statusToCheck)
      .subscribe(allGivenFirstSynonym => {
          // change
          const doNothing = null;
          allGivenFirstSynonym ? this.router.navigate([nextPositiveRoute, this.gameName]) : doNothing;
        }
      );
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
