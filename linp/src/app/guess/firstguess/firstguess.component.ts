import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {GamePlayer, GamePlayerStatus, TeamPartner, TeamTip} from '../../models/game';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GuessService} from '../guess.service';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';

const NEXT_PAGE = '/secondtip';
const tipDBkey = 'firstTeamTip';

@Component({
  selector: 'app-firstguess',
  templateUrl: './firstguess.component.html',
  styleUrls: ['./firstguess.component.css']
})
export class FirstguessComponent implements OnInit, OnDestroy {
  authUser: firebase.User;
  gameName: string;

  selectedGamePlayers: GamePlayer[] = [];
  gamePlayers: GamePlayer[];
  public PLAYER_STATUS_AFTER_ACTION: GamePlayerStatus = 'FIRST_GUESS_GIVEN';


  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private isBlinkTickerShown$: boolean;
  private isloggedInPlayerGivenSynonym = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth,
              public guessService: GuessService) {
    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
      });
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
          return gamePlayer.uid === this.authUser.uid;
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

    this.guessService.saveTeamTip(this.gameName, this.selectedGamePlayers, this.authUser.uid, tipDBkey, this.PLAYER_STATUS_AFTER_ACTION)
      .then(response => {
        alert('Successful saved choice');
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
