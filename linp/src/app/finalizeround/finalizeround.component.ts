import {Component, OnInit} from '@angular/core';
import {FirebaseGameService} from '../services/firebasegame.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GamePlayer, GameStatus, GameTotalPoints} from '../models/game';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-finalizeround',
  templateUrl: './finalizeround.component.html',
  styleUrls: ['./finalizeround.component.scss']
})
export class FinalizeroundComponent implements OnInit {

  private gameName: string;
  private gamePlayers: GamePlayer[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  readonly NEXT_GAME_STATUS: GameStatus = 'preparegame';
  readonly NEXT_PLAYER_STATUS = 'READY_TO_START';
  readonly PREV_PLAYER_STATUS = 'CHECKED_EVALUATION';
  private isGamePlayerReadyForNextGame = false;
  private isLastPlayerToBeReady = false;
  private scores: GameTotalPoints[] = [];
  private isAllPlayersCheckedEvaluation = false;
  private isNextGameStatus = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .subscribe(game => {
        if (game.status !== 'evaluation' || game.status !== this.NEXT_GAME_STATUS) {
          this.router.navigate(['/' + game.status, this.gameName]);
        }
        this.isNextGameStatus = game.status === this.NEXT_GAME_STATUS;

        for (const uid in game.pointsScoredTotal) {
          if (game.pointsScoredTotal.hasOwnProperty(uid)) {
            this.scores.push(game.pointsScoredTotal[uid]);
          }
        }
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;

        const loggedInPlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.authUserUid;
        });

        this.isGamePlayerReadyForNextGame = loggedInPlayer.status === this.NEXT_PLAYER_STATUS;

        this.isAllPlayersCheckedEvaluation = this.gamePlayers.every(gamePlayer => {
          return gamePlayer.status === this.PREV_PLAYER_STATUS;
        });

        const playersReadyCount: number = this.gamePlayers.filter(gamePlayer => {
          return gamePlayer.status === this.NEXT_PLAYER_STATUS;
        }).length;
        this.isLastPlayerToBeReady = playersReadyCount === this.gamePlayers.length - 1;
      });
  }

  startNextRound() {
    this.firebaseGameService.resetPlayer(this.gameName)
      .then(() => {
        this.isGamePlayerReadyForNextGame = true;
      });

    if (this.isLastPlayerToBeReady) {
      this.firebaseGameService.updateGameStatus(this.NEXT_GAME_STATUS, this.gameName)
        .then(() => {
          // TODO d
        });
    }
  }

  // used, so that last player can actually see ranking page, without automatic redirect to new game page
  // a further "ready" button is obsolete with this logic
  goToNextGame() {
    this.router.navigate(['/' + this.NEXT_GAME_STATUS, this.gameName]);
  }
}
