import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFirestore} from 'angularfire2/firestore';
import {Game, GamePlayer, GameStatus, PointsScored, TeamTip} from '../models/game';
import {Observable} from 'rxjs/Observable';
import {first} from 'rxjs/operator/first';
import {HttpClient, HttpParams} from '@angular/common/http';
import {FirebaseGameService} from "../services/firebasegame.service";
import {Subject} from "rxjs/Subject";


@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  authUser: firebase.User;
  gameName: string;
  gamePlayers: GamePlayer[] = [];
  statusToCheck: GameStatus = 'evaluation';
  prevStatus: GameStatus = 'secondguess'; // TODO change to player status
  evaluatedByHostBrowser = false;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

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

        // Missing reliable check
        const isResultsCalculated = game.status === 'evaluation';
        if (isResultsCalculated) {
          gameObservable.unsubscribe();
        }
        const hostUid = game.host;
        const isToBeExecutedOnHostBrowserOnceHack = this.authUser.uid === hostUid && this.evaluatedByHostBrowser !== true;
        if (isResultsCalculated !== true && isToBeExecutedOnHostBrowserOnceHack) {
          this.evaluatedByHostBrowser = true;
          this.firebaseGameService.updateGameStatus('evaluation', this.gameName)
            .then(() => {
              this.evaluateOnServerside();
            });
        }


        // to be moved to server, executable only once
        // this.resetPoints(this.gamePlayers);
        // this.evaluate();
        // async issues
        /*
        this.db.object('games/' + this.gameName + '/players/')
        // reduce to only update totalRounds
          .update(this.gamePlayers)
          .then(response => console.log(response));
      });
      */
      });


  }

  startNextRound() {
    this.router.navigate(['/firsttip', this.gameName]);
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
      });
  }
}
