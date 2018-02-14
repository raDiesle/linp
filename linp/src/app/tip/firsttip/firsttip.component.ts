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

  readonly NEXT_POSITIVE_ROUTE = 'firstguess';
  readonly GAMEPLAYER_STATUS: GamePlayerStatus = 'FIRST_SYNONYM_GIVEN';
  readonly INTERMEDIATE_STATUS = 'preparegame';

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
        if (game.status !== this.INTERMEDIATE_STATUS) {
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

        const isLastPlayerFinishedTurn = !this.currentPlayer;
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
