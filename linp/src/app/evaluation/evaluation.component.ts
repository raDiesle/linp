import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFirestore} from 'angularfire2/firestore';
import {Game, GamePlayer, GamePlayerStatus, GameStatus} from '../models/game';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FirebaseGameService} from '../services/firebasegame.service';
import {Subject} from 'rxjs/Subject';
import {NgbTooltip} from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  numberOfQuestionmarks: number;
  readonly statusToCheck: GameStatus = 'evaluation';
  readonly INTERMEDIATE_STATUS: GameStatus = 'evaluation';
  readonly NEXT_STATUS: GameStatus = 'finalizeround';
  readonly PREV_STATUS: GameStatus = 'secondguess'; // TODO change to player status
  readonly NEXT_PLAYER_STATUS: GamePlayerStatus = 'CHECKED_EVALUATION';
  // readonly PREV_PLAYER_STATUS: GamePlayerStatus = 'SECOND_GUESS_GIVEN';

  gameName: string;
  gamePlayers: GamePlayer[] = [];

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild('t') public tooltip: NgbTooltip;
  public gameRound = 0;
  // deprecated
  public isRealCalculatedHack = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth,
              private httpClient: HttpClient,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((gamePlayers) => {

        this.numberOfQuestionmarks = gamePlayers.filter(gamePlayer => gamePlayer.questionmarkOrWord === '?').length;
        this.gamePlayers = gamePlayers.sort(this.sortByWord);

        this.isRealCalculatedHack = this.gamePlayers.some(gamePlayer => {
          const notYetCalculatedIndication = 0;
          return gamePlayer.pointsScored.total !== notYetCalculatedIndication;
        });
      });

    this.firebaseGameService.observeGame(this.gameName)
      .subscribe(game => {
        this.gameRound = game.round;
      });
  }

private sortByWord(a, b) {
    const nameA = a.questionmarkOrWord.toUpperCase();
    const nameB = b.questionmarkOrWord.toUpperCase();
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }
    // same names
    return 0;
  }

  navigateToFinalizeRound() {
    this.firebaseGameService.updateGamePlayerStatus(
      this.firebaseGameService.authUserUid,
      this.gameName,
      this.NEXT_PLAYER_STATUS)
      .then(() => {
          this.router.navigate([this.NEXT_STATUS, this.gameName]);
      });
  }
}
