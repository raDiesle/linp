import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {Game, GamePlayer, GamePlayerStatus, GameStatus} from '../../models/game';
import {Subject} from 'rxjs/Subject';
import {FirsttipService} from './firsttip.service';
import {FirebaseGameService} from "../../services/firebasegame.service";

const NEXT_POSITIVE_ROUTE = 'firstguess';

@Component({
  selector: 'app-firsttip',
  templateUrl: './firsttip.component.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit, OnDestroy {
  loggedInGamePlayer: GamePlayer;

  FIRST_SYNONYM_GIVEN_PLAYER_STATUS: GamePlayerStatus = 'FIRST_SYNONYM_GIVEN';

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
              public afAuth: AngularFireAuth,
              private firsttipService: FirsttipService,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.firebaseGameService.observeGames()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(res => {
        console.log('TRIGGERED');
      });

    this.gameName = this.route.snapshot.paramMap.get('gamename');

    Observable.timer(0, 1000).subscribe(number => {
      this.show$ = number % 2 === 0;
    });

    // asyn issue later
    const authPromise = this.afAuth.authState
      .first()
      .toPromise()
      .then(authUser => {
        this.authUser = authUser
      });

    this.db
      .collection('games')
      .doc(this.gameName)
      .collection<GamePlayer>('players')
      .valueChanges()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.loggedInGamePlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.authUser.uid;
        });
// guarantee position missing
        this.currentPlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.status !== this.FIRST_SYNONYM_GIVEN_PLAYER_STATUS;
        });

        const isAllGivenFirstSynonym = gamePlayers.every(gamePlayer => {
          return gamePlayer.status === this.FIRST_SYNONYM_GIVEN_PLAYER_STATUS;
        });
        if (isAllGivenFirstSynonym) {
          this.allGivenFirstSynonymAction();
        }
      });
  }

  sendSynonym() {
    this.firsttipService.sendSynonym(this.FIRST_SYNONYM_GIVEN_PLAYER_STATUS, this.synonym, this.gameName, this.authUser)
      .then(gamePlayerModel => console.log('Successful saved'));
  }

  private allGivenFirstSynonymAction() {
    const waitPromise = this.loggedInGamePlayer.isHost ? this.firsttipService.updateGameStatusToNextPage(this.gameName, NEXT_POSITIVE_ROUTE) : Promise.resolve();
    waitPromise
      .then(done => {
        this.router.navigate([NEXT_POSITIVE_ROUTE, this.gameName]);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
