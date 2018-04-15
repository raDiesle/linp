import { PlayerRolesCounts } from './../models/game.d';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AngularFirestore} from 'angularfire2/firestore';
import {Game, GamePlayer, GameStatus} from '../models/game';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import {FirebaseGameService} from '../services/firebasegame.service';

@Component({
  selector: 'app-preparegame',
  templateUrl: './preparegame.component.html',
  styleUrls: ['./preparegame.component.scss']
})
export class PreparegameComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private rolesDistributionInformation: PlayerRolesCounts;
  private gamePlayers: GamePlayer[];
  public isRoleAssigned = false;
  private isQuestionmark = false;
  private currentGamePlayersRoleWord: string;
  private gameName: string;

  // TODO remove, deprecated and wrong
  private hasStartedGame = false;
  private isNeededToUpdateStatus: boolean = null;

  readonly NEXT_PLAYER_STATUS = 'READY_TO_START';
  readonly CURRENT_STATUS = 'JOINED_GAME';
  readonly NEXT_PAGE: GameStatus = 'firsttip';

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        this.router.navigate(['/' + game.status, this.gameName]);
        this.rolesDistributionInformation = game.playerRolesCounts;
        this.isRoleAssigned = this.rolesDistributionInformation !== null;
      });

      this.firebaseGameService.observeLoggedInGamePlayer(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      // .toPromise()
      .subscribe((currentGamePlayer: GamePlayer) => {
        this.isQuestionmark = currentGamePlayer.questionmarkOrWord === '?';
        this.currentGamePlayersRoleWord = currentGamePlayer.questionmarkOrWord;
        this.isNeededToUpdateStatus = currentGamePlayer.status === this.CURRENT_STATUS;
      });
  }

  startGameAction(): void {
    this.hasStartedGame = true;

    let promise = Promise.resolve();
    if (this.isNeededToUpdateStatus === true) {
      promise = this.firebaseGameService.updateCurrentGamePlayerStatus(this.gameName, this.NEXT_PLAYER_STATUS);
    }

    promise.then(done => {
      this.navigateNextPage();
    });
  }

  private navigateNextPage() {
    this.router.navigate([this.NEXT_PAGE, this.gameName]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
