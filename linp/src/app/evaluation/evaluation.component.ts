import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFirestore} from 'angularfire2/firestore';
import {Game, GamePlayer, GameStatus} from '../models/game';
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

  readonly statusToCheck: GameStatus = 'evaluation';
  readonly INTERMEDIATE_STATUS = 'evaluation';
  readonly prevStatus: GameStatus = 'secondguess'; // TODO change to player status

  authUser: firebase.User;
  gameName: string;
  gamePlayers: GamePlayer[] = [];
  evaluatedByHostBrowser = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  @ViewChild('t') public tooltip: NgbTooltip;
  private gameRound = 0;
  private isResultsCalculated = false;
  private currentTooltipIndirectPointsGamePlayer: GamePlayer;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth,
              private httpClient: HttpClient,
              private firebaseGameService: FirebaseGameService) {
    afAuth.authState.subscribe(authUser => {
      this.authUser = authUser;
    });
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((gamePlayers) => {
        this.gamePlayers = gamePlayers;
      });

    const gameObservable = this.db
      .collection('games')
      .doc<Game>(this.gameName)
      .valueChanges()
      .subscribe(gameRef => {
        // hack to not have cheap non serverside trigger
        const game: Game = gameRef;
        this.gameRound = game.round;
        // Missing reliable check

        this.isResultsCalculated = game.status === this.INTERMEDIATE_STATUS;

        if (this.isResultsCalculated) {
          gameObservable.unsubscribe();
        }
        const hostUid = game.host;
        const isToBeExecutedOnHostBrowserOnceHack = this.authUser.uid === hostUid && this.evaluatedByHostBrowser !== true;
        if (this.isResultsCalculated !== true && isToBeExecutedOnHostBrowserOnceHack) {
          this.evaluatedByHostBrowser = true;
          this.firebaseGameService.updateGameStatus(this.INTERMEDIATE_STATUS, this.gameName)
            .then(() => {
              this.evaluateOnServerside();
            });
        }
      });
  }

  navigateToFinalizeRound() {
    this.router.navigate(['/finalizeround', this.gameName]);
  }

// move to service
  private evaluateOnServerside() {
    const url = 'https://us-central1-linp-c679b.cloudfunctions.net/evaluate';
// ONLY SET EVALUATE STATE
    // const headers = new Headers({'Authorization': 'Bearer ' + this.authUser.uid});
    this.httpClient
      .get(url,
        {
          // headers: headers,
          params: new HttpParams()
            .set('status', this.prevStatus)
            .set('gameName', this.gameName)
        })
      .subscribe(response => {
        console.log('calculated evaluation on serverside');
      }, err => {
        console.log('calculated with error');
      });
  }
}
