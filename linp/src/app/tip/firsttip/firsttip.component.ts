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

  readonly NEXT_PAGE = 'firstguess';
  readonly NEXT_STATUS: GamePlayerStatus = 'FIRST_SYNONYM_GIVEN';
  readonly INTERMEDIATE_STATUS = 'preparegame';
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
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        if (game.status !== this.INTERMEDIATE_STATUS) {
          this.router.navigate(['/' + game.status, this.gameName]);
        }
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;

        this.loggedInGamePlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.getAuthUid();
        });

        this.currentPlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.status !== this.NEXT_STATUS;
        });

        const isLastPlayerFinishedTurn = !this.currentPlayer;
        this.isPlayersTurnForAuthUser = !isLastPlayerFinishedTurn ? this.isYourTurn() : false;
      });

    Observable.timer(0, 1000).subscribe(number => {
      this.show$ = number % 2 === 0;
    });
  }

private isYourTurn() {
  return this.currentPlayer.uid === this.loggedInGamePlayer.uid;
}

  sendSynonym() {
    const firstOrSecondGamePlayerUpdate = {
      status : this.NEXT_STATUS
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
