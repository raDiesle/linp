import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import {GamePlayer, GamePlayerStatus} from '../../models/game';
import {Subject} from 'rxjs/Subject';
import {FirebaseGameService} from '../../services/firebasegame.service';
import {AngularFireAuth} from 'angularfire2/auth';


@Component({
  selector: 'app-firsttip',
  templateUrl: './firsttip.component.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit, OnDestroy {
  loggedInGamePlayer: GamePlayer;

  READY_FOR_GAME: GamePlayerStatus = 'READY_TO_START';
  readonly NEXT_POSITIVE_ROUTE = 'firstguess';
  GAMEPLAYER_STATUS: GamePlayerStatus = 'FIRST_SYNONYM_GIVEN';

  authUser: firebase.User;
  gamePlayers: GamePlayer[];
  gameName: string;
  // @input
  private synonym: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private currentPlayer: GamePlayer;
  public show$: boolean;
  private isPlayersTurnForAuthUser = false;
  private savedResponseFlag = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        if (game.status !== 'preparegame') {
          this.router.navigate(['/' + game.status, this.gameName]);
        }
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;

        this.loggedInGamePlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.authUserUid;
        });
        this.currentPlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.status !== this.GAMEPLAYER_STATUS;
        });
        this.isPlayersTurnForAuthUser = this.currentPlayer.uid === this.firebaseGameService.authUserUid;

        if (this.loggedInGamePlayer.isHost) {
          this.checkAndUpdateGameStatus(this.gameName, this.gamePlayers);
        }
      });

    Observable.timer(0, 1000).subscribe(number => {
      this.show$ = number % 2 === 0;
    });

  }

  sendSynonym() {
    this.firebaseGameService.sendSynonym(this.GAMEPLAYER_STATUS, this.synonym, this.gameName)
      .then(gamePlayerModel => {
        // TODO
        this.savedResponseFlag = true;
      });
  }

  private checkAndUpdateGameStatus(gameName: string, gamePlayers: GamePlayer[]) {
    const isAllAreReadyOnPreparedGame = gamePlayers.every(gamePlayer => {
      return gamePlayer.status === this.READY_FOR_GAME;
    });
    if (isAllAreReadyOnPreparedGame) {
      this.firebaseGameService.updateGameStatus('firsttip', gameName);
    }

    const isAllGivenFirstSynonym = gamePlayers.every(gamePlayer => {
      return gamePlayer.status === this.GAMEPLAYER_STATUS;
    });
    if (isAllGivenFirstSynonym) {
      this.firebaseGameService.updateGameStatus(this.NEXT_POSITIVE_ROUTE, gameName);
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
