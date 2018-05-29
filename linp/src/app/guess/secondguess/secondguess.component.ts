import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {GamePlayer, GamePlayerStatus, GameStatus} from 'app/models/game';
import {GuessService} from '../guess.service';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import {FirebaseGameService} from '../../services/firebasegame.service';
import {ActionguideService} from '../../services/actionguide.service';

const tipDBkey = 'secondTeamTip';

@Component({
  selector: 'app-secondguess',
  templateUrl: './../guesstemplate.outlet.html',
  styleUrls: ['./secondguess.component.css']
})
export class SecondguessComponent implements OnInit, OnDestroy {

  playerUidToDisableForSelection: string;
  public loggedInGamePlayer: GamePlayer;
  readonly PLAYER_STATUS_AFTER_ACTION: GamePlayerStatus = 'SECOND_GUESS_GIVEN';
  readonly NEXT_PAGE: GameStatus = 'evaluation';

  gameName: string;

  selectedGamePlayers: GamePlayer[] = [];
  gamePlayers: GamePlayer[];
  public isloggedInPlayerDidGuess = false;
  public savedResponseFlag = false;
  public isSecondGuess = true;
  public isOnlyOnePlayerLeftForAction = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private isBlinkTickerShown$: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              public guessService: GuessService,
              private firebaseGameService: FirebaseGameService,
              private actionguideService: ActionguideService) {
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
      .subscribe((gamePlayrs: GamePlayer[]) => {
        this.gamePlayers = gamePlayrs;
        this.isOnlyOnePlayerLeftForAction = gamePlayrs.filter(player => player.status !== this.PLAYER_STATUS_AFTER_ACTION).length <= 1;

        const isSwitchGameStatus = gamePlayrs.every(gamePlayers => gamePlayers.status === this.PLAYER_STATUS_AFTER_ACTION);
        if (isSwitchGameStatus) {
          return;
        }

        const loggedInGamePlayer = gamePlayrs.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.authUserUid;
        });
        this.loggedInGamePlayer = loggedInGamePlayer;
        this.isloggedInPlayerDidGuess = loggedInGamePlayer.status === this.PLAYER_STATUS_AFTER_ACTION;

        if (this.isloggedInPlayerDidGuess === true) {
          this.actionguideService.triggerActionDone(this.gamePlayers);
        }

        if (this.isloggedInPlayerDidGuess === true) {
          this.actionguideService.triggerActionDone(this.gamePlayers);
        }
      });

    Observable.timer(0, 1000)
      .subscribe(number => {
        this.isBlinkTickerShown$ = number % 2 === 0;
      });
  }

  onTeamPlayerGuessSelected(clickedGamePlayer): void {

    // const canSelectDeselectToBeOneSelected = this.selectedGamePlayers.length !== 1;
    // const isPossibleDuplicatedChoiceOfTeamGuess = canSelectDeselectToBeOneSelected;

    if (clickedGamePlayer.uid === this.playerUidToDisableForSelection) {
      return;
    }

    const isFirstSelected = clickedGamePlayer.uid === this.loggedInGamePlayer.firstTeamTip.firstPartner.uid
      || (this.selectedGamePlayers.filter(gamePlayer =>
        gamePlayer.uid === this.loggedInGamePlayer.firstTeamTip.firstPartner.uid).length === 1);

    const isSecondSelected = clickedGamePlayer.uid === this.loggedInGamePlayer.firstTeamTip.secondPartner.uid
      || (this.selectedGamePlayers.filter(gamePlayer =>
        gamePlayer.uid === this.loggedInGamePlayer.firstTeamTip.secondPartner.uid).length === 1);

    if (isFirstSelected) {
      this.playerUidToDisableForSelection = this.loggedInGamePlayer.firstTeamTip.secondPartner.uid;
    }
    if (isSecondSelected) {
      this.playerUidToDisableForSelection = this.loggedInGamePlayer.firstTeamTip.firstPartner.uid;
    }

    if (this.selectedGamePlayers.filter(gamePlayer => gamePlayer.uid === clickedGamePlayer.uid).length === 1) {
      if (clickedGamePlayer.uid === this.loggedInGamePlayer.firstTeamTip.firstPartner.uid
        || clickedGamePlayer.uid === this.loggedInGamePlayer.firstTeamTip.secondPartner.uid) {
        this.playerUidToDisableForSelection = '';
      }
    }

    this.selectedGamePlayers = this.guessService.onTeamPlayerGuessSelected(this.selectedGamePlayers, clickedGamePlayer);
  }

  public saveTeamTip(): void {
    this.guessService.saveTeamTip(this.gameName, this.selectedGamePlayers, tipDBkey, this.PLAYER_STATUS_AFTER_ACTION)
      .then(() => {
        this.savedResponseFlag = true;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
