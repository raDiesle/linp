import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { GamePlayer, GamePlayerStatus, GameStatus } from '../../models/game';
import { GuessService } from '../guess.service';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { FirebaseGameService } from '../../services/firebasegame.service';

const tipDBkey = 'firstTeamTip';

@Component({
  selector: 'app-firstguess',
  templateUrl: './../guesstemplate.outlet.html',
  styleUrls: ['./firstguess.component.css']
})
export class FirstguessComponent implements OnInit, OnDestroy {

  selectedGamePlayers: GamePlayer[] = [];
  gamePlayers: GamePlayer[];
  public waitingGamePlayerNames: string[] = [];
  public loggedInGamePlayer: GamePlayer;

  readonly PLAYER_STATUS_AFTER_ACTION: GamePlayerStatus = 'FIRST_GUESS_GIVEN';
  readonly NEXT_PAGE: GameStatus = 'secondtip';
  public isSecondGuess = false;

  gameName: string;

  public savedResponseFlag = false;
  public isloggedInPlayerDidGuess = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private isBlinkTickerShown$: boolean;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public db: AngularFirestore,
    public guessService: GuessService,
    private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        this.router.navigate(['/' + game.status, this.gameName], { skipLocationChange: true });
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((gamePlayers: GamePlayer[]) => {
        this.gamePlayers = gamePlayers;

        this.waitingGamePlayerNames = this.gamePlayers.filter(player => player.status !== this.PLAYER_STATUS_AFTER_ACTION)
        .map(player => player.name);

        const isGameStatusSwitch = gamePlayers.every(gamePlayer => gamePlayer.status === this.PLAYER_STATUS_AFTER_ACTION);
        if (isGameStatusSwitch) {
          return;
        }

        this.loggedInGamePlayer = gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.getAuthUid();
        });
        this.isloggedInPlayerDidGuess = this.loggedInGamePlayer.status === this.PLAYER_STATUS_AFTER_ACTION;

        if (this.isloggedInPlayerDidGuess === false) {
          this.selectedGamePlayers[0] = this.loggedInGamePlayer;
        }

      });

    Observable.timer(0, 1000)
      .subscribe(number => {
        this.isBlinkTickerShown$ = number % 2 === 0;
      });
  }

  onTeamPlayerGuessSelected(clickedGamePlayer): void {
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
