import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {GamePlayer, GamePlayerStatus, GameStatus} from '../../models/game';
import {GuessService} from '../guess.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {FirebaseGameService} from '../../services/firebasegame.service';

const tipDBkey = 'firstTeamTip';

@Component({
  selector: 'app-firstguess',
  templateUrl: './firstguess.component.html',
  styleUrls: ['./firstguess.component.css']
})
export class FirstguessComponent implements OnInit, OnDestroy {
  gameName: string;

  selectedGamePlayers: GamePlayer[] = [];
  gamePlayers: GamePlayer[];
  readonly PLAYER_STATUS_AFTER_ACTION: GamePlayerStatus = 'FIRST_GUESS_GIVEN';
  readonly NEXT_PAGE: GameStatus = 'secondtip';

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private isBlinkTickerShown$: boolean;
  private isloggedInPlayerGivenSynonym = false;
  private savedResponseFlag = false;

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
        this.router.navigate(['/' + game.status, this.gameName]);
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((gamePlayers: GamePlayer[]) => {
        this.gamePlayers = gamePlayers;

        const loggedInGamePlayer = gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.authUserUid;
        });
        this.isloggedInPlayerGivenSynonym = loggedInGamePlayer.status === this.PLAYER_STATUS_AFTER_ACTION;
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
      .then(response => {
        this.savedResponseFlag = true;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
