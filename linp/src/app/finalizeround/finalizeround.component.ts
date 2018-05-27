import {Component, OnDestroy, OnInit} from '@angular/core';
import {FirebaseGameService} from '../services/firebasegame.service';
import {ActivatedRoute, Router} from '@angular/router';
import {GamePlayer, GameTotalPoints} from 'app/models/game';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-finalizeround',
  templateUrl: './finalizeround.component.html',
  styleUrls: ['./finalizeround.component.scss']
})
export class FinalizeroundComponent implements OnInit, OnDestroy {

  public gamePlayers: GamePlayer[] = [];

  readonly NEXT_PLAYER_STATUS = 'READY_FOR_NEXT_GAME';

  public isGamePlayerReadyForNextGame = false;
  public scores: GameTotalPoints[] = [];
  public savedResponseFlag = false;
  private gameName: string;
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
        if (game.status !== 'evaluation') {
          this.router.navigate(['/' + game.status, this.gameName], {skipLocationChange: true});
        }

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

        const loggedInPlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.authUserUid;
        });

        this.isGamePlayerReadyForNextGame = loggedInPlayer.status === this.NEXT_PLAYER_STATUS;
      });
  }

  startNextRound() {
    if (this.isGamePlayerReadyForNextGame === true) {
      this.router.navigate(['/' + 'firsttip', this.gameName], {skipLocationChange: true});
    } else {
      this.firebaseGameService.updateCurrentGamePlayerStatus(this.gameName, this.NEXT_PLAYER_STATUS)
        .then(() => {
          this.savedResponseFlag = true;
          this.router.navigate(['/' + 'firsttip', this.gameName], {skipLocationChange: true});
        })
    }
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
