import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {GamePlayer, GameStatus, PointsScored, TeamTip} from '../models/game';
import {Observable} from 'rxjs/Observable';
import {first} from "rxjs/operator/first";
import {HttpClient, HttpParams} from "@angular/common/http";


@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  authUser: firebase.User;
  gameName: string;
  gamePlayers: { [uid: string]: GamePlayer };
  gamePlayerKeys: string[];
  statusToCheck: GameStatus = 'EVALUATED';
  prevStatus: GameStatus = 'SECOND_GUESS_GIVEN';
  evaluatedByHostBrowser: boolean = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              private httpClient: HttpClient) {
    afAuth.authState.subscribe(response => {
      this.authUser = response;
    });
  }

  ngOnInit() {


    this.gameName = this.route.snapshot.paramMap.get('gamename');

    const gamePlayersObservable = this.db.object('/games/' + this.gameName
    )
      .subscribe(gameRef => {
        // hack to not have cheap non serverside trigger
        const game = gameRef;//.val();
        const isResultsCalculated = game.status === 'EVALUATED';
        if (isResultsCalculated) {
          gamePlayersObservable.unsubscribe();
        }
        const hostUid = game.host;
        const isToBeExecutedOnHostBrowserOnceHack = this.authUser.uid === hostUid && this.evaluatedByHostBrowser !== true;
        if (isResultsCalculated !== true && isToBeExecutedOnHostBrowserOnceHack) {
          this.evaluatedByHostBrowser = true;
          this.evaluateOnServerside();
        }

        console.log('getting player details');
        this.gamePlayers = game.players;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);


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
