import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GamePlayer, GamePlayerStatus, GameStatus} from '../../models/game';
import {Subject} from 'rxjs/Subject';
import {FirebaseGameService} from '../../services/firebasegame.service';


@Component({
  selector: 'app-secondtip',
  templateUrl: './secondtip.component.html',
  styleUrls: ['./secondtip.component.css']
})
export class SecondtipComponent implements OnInit, OnDestroy {
  loggedInGamePlayer: GamePlayer;

  readonly GAMEPLAYER_STATUS: GamePlayerStatus = 'SECOND_SYNONYM_GIVEN';
  readonly NEXT_POSITIVE_ROUTE = 'secondguess';

  readonly INTERMEDIATE_STATUS = '';

  authUser: firebase.User;
  gamePlayers: GamePlayer[];
  gameName: string;
  // @input
  private synonym: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public show$: boolean;
  private currentPlayer: GamePlayer;
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
          this.router.navigate(['/' + game.status, this.gameName]);
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

        const isLastPlayerFinishedTurn = !this.currentPlayer;
        if (isLastPlayerFinishedTurn) {
          this.checkAndUpdateGameStatus(this.gameName, this.gamePlayers);
        }
        this.isPlayersTurnForAuthUser = !isLastPlayerFinishedTurn ? this.currentPlayer.uid === this.firebaseGameService.authUserUid : false;
      });

    Observable.timer(0, 1000).subscribe(number => {
      this.show$ = number % 2 === 0;
    });

  }

  sendSynonym() {
    this.firebaseGameService.sendSynonym(this.GAMEPLAYER_STATUS, this.synonym, this.gameName)
      .then(gamePlayerModel => {
        this.savedResponseFlag = true;
      });
  }

  private checkAndUpdateGameStatus(gameName: string, gamePlayers: GamePlayer[]) {
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
