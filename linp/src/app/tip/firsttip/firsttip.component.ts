import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { GamePlayer, GamePlayerStatus, GameStatus } from '../../models/game';
import { Subject } from 'rxjs/Subject';
import { FirebaseGameService } from '../../services/firebasegame.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActionguideDto, ActionguideService } from '../../services/actionguide.service';

@Component({
  selector: 'app-firsttip',
  templateUrl: '../tiptemplate.outlet.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit, OnDestroy {
  public loggedInGamePlayer: GamePlayer;

  public isSecondtip = false;
  readonly NEXT_PAGE = 'firstguess';
  readonly NEXT_STATUS: GamePlayerStatus = 'FIRST_SYNONYM_GIVEN';
  readonly SYNONYM_KEY = 'firstSynonym';

  public show$: boolean;
  public isOpened: boolean;
  public isPlayersTurnForAuthUser = false;
  public savedResponseFlag = false;
  authUser: firebase.User;
  gamePlayers: GamePlayer[];
  gameName: string;
  // @input
  private synonym: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private currentPlayer: GamePlayer;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private firebaseGameService: FirebaseGameService,
    private actionguideService: ActionguideService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        if (game.status === 'evaluation' || game.status === 'finalizeround') {
          return;
        }
        this.router.navigate(['/' + game.status, this.gameName], { skipLocationChange: true });
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.currentPlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.status !== this.NEXT_STATUS;
        });
        const isNextGameStatusSwitch = this.currentPlayer === null;
        if (isNextGameStatusSwitch) {
          return;
        };

        this.loggedInGamePlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.getAuthUid();
        });

        this.isPlayersTurnForAuthUser = this.currentPlayer.uid === this.loggedInGamePlayer.uid;
        if (this.isPlayersTurnForAuthUser === false) {
          this.actionguideService.triggerActionDone();
        }
      });

    Observable.timer(0, 1000).subscribe(number => {
      this.show$ = number % 2 === 0;
    });
  }

  sendSynonym() {
    const firstOrSecondGamePlayerUpdate = {
      status: this.NEXT_STATUS
    };
    firstOrSecondGamePlayerUpdate[this.SYNONYM_KEY] = this.synonym;

    this.firebaseGameService.sendSynonym(firstOrSecondGamePlayerUpdate, this.gameName)
      .then(gamePlayerModel => {
        this.savedResponseFlag = true;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
