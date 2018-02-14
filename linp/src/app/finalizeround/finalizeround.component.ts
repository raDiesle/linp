import {Component, OnDestroy, OnInit} from '@angular/core';
import {FirebaseGameService} from '../services/firebasegame.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GamePlayer, GameStatus, GameTotalPoints} from '../models/game';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-finalizeround',
  templateUrl: './finalizeround.component.html',
  styleUrls: ['./finalizeround.component.scss']
})
export class FinalizeroundComponent implements OnInit, OnDestroy {

  private gameName: string;
  private gamePlayers: GamePlayer[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  readonly NEXT_GAME_STATUS: GameStatus = 'preparegame';
  readonly NEXT_PLAYER_STATUS = 'READY_FOR_NEXT_GAME';
  readonly PREV_PLAYER_STATUS = 'CHECKED_EVALUATION';

  private isGamePlayerReadyForNextGame = false;
  private scores: GameTotalPoints[] = [];

  public savedResponseFlag = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {

        if (game.status !== 'evaluation') {
          this.router.navigate(['/' + game.status, this.gameName]);
        }

        for (const uid in game.pointsScoredTotal) {
          if (game.pointsScoredTotal.hasOwnProperty(uid)) {
            this.scores.push(game.pointsScoredTotal[uid]);
          }
        }
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;

        const loggedInPlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.authUserUid;
        });

        this.isGamePlayerReadyForNextGame = loggedInPlayer.status === this.NEXT_PLAYER_STATUS;
      });
  }

  startNextRound() {
    this.isGamePlayerReadyForNextGame = true;
    this.firebaseGameService.updateCurrentGamePlayerStatus(this.gameName, this.NEXT_PLAYER_STATUS)
    .then(() => {
      this.savedResponseFlag = true;
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
