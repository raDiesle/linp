import { Component, OnDestroy, OnInit } from '@angular/core';
import { FirebaseGameService } from '../services/firebasegame.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GamePlayer, GameTotalPoints, GamePlayerStatus, GameStatus } from 'app/models/game';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-finalizeround',
  templateUrl: './finalizeround.component.html',
  styleUrls: ['./finalizeround.component.scss']
})
export class FinalizeroundComponent implements OnInit, OnDestroy {

  public gameRound: number;
  public gamePlayers: GamePlayer[] = [];

  public isGamePlayerReadyForNextGame = false;
  public scores: GameTotalPoints[] = [];

  public loggedinGamePlayerName: string;
  public loggedinGamePlayerStatus: GamePlayerStatus;
  public savedResponseFlag = false;
  public noEvaluationDataAvailable: boolean = null;
  public gameName: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
    private router: Router,
    private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        this.gameRound = game.round;

        this.noEvaluationDataAvailable = game.round === 0 && [null, undefined].includes(game.evaluationSummary);
        if (this.noEvaluationDataAvailable) {
          return;
        }
        /*
        if (game.status !== 'evaluation') {
          this.router.navigate(['/' + game.status, this.gameName], {skipLocationChange: true});
        }
        */

        for (const uid in game.pointsScoredTotal) {
          if (game.pointsScoredTotal.hasOwnProperty(uid)) {
            this.scores.push(game.pointsScoredTotal[uid]);
          }
        }
        this.scores = this.getSortedScore(this.scores);
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;

        const loggedinGamePlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.authUserUid;
        });
        this.loggedinGamePlayerName = loggedinGamePlayer.name;
        this.loggedinGamePlayerStatus = loggedinGamePlayer.status;
      });
  }

  startNextRound() {
    let promise = Promise.resolve();
    if (this.loggedinGamePlayerStatus === 'CHECKED_EVALUATION') {
      promise = this.firebaseGameService.updateCurrentGamePlayerStatus(this.gameName, 'READY_FOR_NEXT_GAME')
      this.ngOnDestroy();
    }
    promise.then(() => {
      this.savedResponseFlag = true;
      const nextStatus: GameStatus = 'firsttip';
      this.router.navigate(['/' + nextStatus , this.gameName], { skipLocationChange: true });
    });
  }

  getSortedScore(scores) {
    return scores.sort((a, b) => {
      if (a.ranking > b.ranking) {
        return 1;
      }
      if (a.value < b.value) {
        return -1;
      }
      return 0;
    });
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
