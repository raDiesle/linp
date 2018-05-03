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

  readonly PREV_STATUS: GameStatus = 'secondguess'; // TODO change to player status

  // readonly PREV_PLAYER_STATUS: GamePlayerStatus = 'SECOND_GUESS_GIVEN';

  gameName: string;
  // gamePlayers: GamePlayer[] = [];
  gamePlayerContainer: any;

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
/*
        gamePlayers.push({questionmarkOrWord: '?',  pointsScored: {
          firstTeamTip: 0,
          secondTeamTip: 0,
          total: 0,
          totalRounds: 0,
          indirect: 0
        }});
*/
        const questionmarkPlayers = gamePlayers.filter(gamePlayer => gamePlayer.questionmarkOrWord === '?');
        const wordPlayers = gamePlayers.filter(gamePlayer => gamePlayer.questionmarkOrWord !== '?').sort(this.sortByWord);

        this.numberOfQuestionmarks = questionmarkPlayers.length;

        // this.gamePlayers = gamePlayers.sort(this.sortByWord);
        this.gamePlayerContainer = {
            'QUESTIONMARK' : questionmarkPlayers,
            'WORD' : wordPlayers
          };

        this.isRealCalculatedHack = gamePlayers.some(gamePlayer => {
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

}
