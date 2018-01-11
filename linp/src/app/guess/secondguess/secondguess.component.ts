import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {Game, GamePlayer, GamePlayerStatus, GameStatus, TeamTip} from '../../models/game';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GuessService} from '../guess.service';
import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Subject} from 'rxjs/Subject';
import {FirebaseGameService} from '../../services/firebasegame.service';

const NEXT_PAGE = '/evaluation';
const tipDBkey = 'firstTeamTip';

@Component({
  selector: 'app-secondguess',
  templateUrl: './secondguess.component.html',
  styleUrls: ['./secondguess.component.css']
})
export class SecondguessComponent implements OnInit, OnDestroy {

  public PLAYER_STATUS_AFTER_ACTION: GamePlayerStatus = 'SECOND_GUESS_GIVEN';

  gameName: string;

  selectedGamePlayers: GamePlayer[] = [];
  gamePlayers: GamePlayer[];


  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private isBlinkTickerShown$: boolean;
  private isloggedInPlayerGivenSynonym = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              public guessService: GuessService,
              public firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    Observable.timer(0, 1000).subscribe(number => {
      this.isBlinkTickerShown$ = number % 2 === 0;
    });

    this.db
      .collection('games')
      .doc(this.gameName)
      .collection<GamePlayer>('players')
      .valueChanges()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((gamePlayers: GamePlayer[]) => {
        this.gamePlayers = gamePlayers;

        const loggedInGamePlayer = gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.authUserUid;
        });
        this.isloggedInPlayerGivenSynonym = loggedInGamePlayer.status === this.PLAYER_STATUS_AFTER_ACTION;

        const allGivenGuess = gamePlayers.every(gamePlayer => {
          return gamePlayer.status === this.PLAYER_STATUS_AFTER_ACTION;
        });
        if (allGivenGuess) {
          this.router.navigate([NEXT_PAGE, this.gameName]);
        }
      });
  }

  onTeamPlayerGuessSelected(clickedGamePlayer): void {
    this.selectedGamePlayers = this.guessService.onTeamPlayerGuessSelected(this.selectedGamePlayers, clickedGamePlayer);
  }

  public saveTeamTip(): void {
    this.guessService.saveTeamTip(this.gameName, this.selectedGamePlayers, tipDBkey, this.PLAYER_STATUS_AFTER_ACTION)
      .then(response => {
        alert('Successful saved choice');
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
