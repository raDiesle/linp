import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { GamePlayer, GameStatus } from 'app/models/game';
import { HttpClient } from '@angular/common/http';
import { FirebaseGameService } from '../services/firebasegame.service';
import { Subject } from 'rxjs/Subject';
import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit, OnDestroy {


  public noEvaluationDataAvailable: boolean = null;
  numberOfQuestionmarks: number;
  readonly statusToCheck: GameStatus = 'evaluation';
  readonly INTERMEDIATE_STATUS: GameStatus = 'evaluation';

  readonly PREV_STATUS: GameStatus = 'secondguess'; // TODO change to player status
  readonly NEXT_STATUS: GameStatus = 'finalizeround';
  readonly NEXT_NEXT_STATUS: GameStatus = 'firsttip';

  // readonly PREV_PLAYER_STATUS: GamePlayerStatus = 'SECOND_GUESS_GIVEN';

  public loggedinGamePlayer: GamePlayer;

  gameName: string;
  // gamePlayers: GamePlayer[] = [];
  gamePlayerContainer: any;

  @ViewChild('t') public tooltip: NgbTooltip;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
    private router: Router,
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private httpClient: HttpClient,
    private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    // might refactor to rely on auth user
    this.firebaseGameService.observeLoggedInGamePlayer(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayer => {
        this.loggedinGamePlayer = gamePlayer;
/*
        if (gamePlayer.status === 'CHECKED_EVALUATION') {
          this.router.navigate(['/' + this.NEXT_STATUS, this.gameName], { skipLocationChange: true });
          this.ngOnDestroy();
          return;
        } else if (gamePlayer.status === 'READY_FOR_NEXT_GAME') {
          this.router.navigate(['/' + this.NEXT_NEXT_STATUS, this.gameName], { skipLocationChange: true });
          this.ngOnDestroy();
          return;
        }
        */
      });

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {

        this.noEvaluationDataAvailable = game.round === 0 && [null, undefined].includes(game.evaluationSummary);
        if (this.noEvaluationDataAvailable) {
          return;
        }

        // if (game.status !== this.statusToCheck) {
        // this.router.navigate(['/' + game.status, this.gameName], {skipLocationChange: true});
        //  return;
        // }

        this.dataSetup(game.evaluationSummary);
      });
    //  }
    // });
  }

  private dataSetup(gamePlayers: GamePlayer[]) {
    const questionmarkPlayers = gamePlayers.filter(gamePlayer => gamePlayer.questionmarkOrWord === '?');
    const wordPlayers = gamePlayers.filter(gamePlayer => gamePlayer.questionmarkOrWord !== '?').sort(this.sortByWord);
    this.numberOfQuestionmarks = questionmarkPlayers.length;

    // this.gamePlayers = gamePlayers.sort(this.sortByWord);
    this.gamePlayerContainer = {
      'QUESTIONMARK': questionmarkPlayers,
      'WORD': wordPlayers
    };
  }

  private arrayContainsArray(superset, subset) {
    return subset.every(function (value) {
      return (superset.indexOf(value) >= 0);
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
