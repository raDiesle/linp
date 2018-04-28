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

  readonly NEXT_STATUS: GamePlayerStatus = 'SECOND_SYNONYM_GIVEN';
  readonly NEXT_PAGE = 'secondguess';
  readonly SYNONYM_KEY = 'secondSynonym';
  readonly INTERMEDIATE_STATUS = '';

  authUser: firebase.User;
  gamePlayers: GamePlayer[];
  gameName: string;
  public isOpened: boolean;
  public savedResponseFlag = false;
  public isPlayersTurnForAuthUser = false;

  // @input
  private synonym: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public show$: boolean;
  private currentPlayer: GamePlayer;



  constructor(private route: ActivatedRoute,
              private router: Router,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
          this.router.navigate(['/' + game.status, this.gameName], {skipLocationChange: true});
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
