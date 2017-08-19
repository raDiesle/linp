import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {GamePlayer, PointsScored, TeamTip} from '../models/game';
import {Observable} from 'rxjs/Observable';
import {CalculatescoreService} from './calculatescore.service';
import {first} from "rxjs/operator/first";


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

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              private calculatescoreService: CalculatescoreService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
    const gamePlayersObservable = this.db.object('/games/' + this.gameName + '/players'
      , {preserveSnapshot: true}
    )
      .subscribe(gamePlayers => {
        console.log("changed");
        this.gamePlayers = gamePlayers.val();
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
        gamePlayersObservable.unsubscribe();

        // to be moved to server, executable only once
        this.resetPoints();
        this.evaluate();
        // async issues
        this.db.object('games/' + this.gameName + '/players/')
        // reduce to only update totalRounds
          .update(this.gamePlayers)
          .then(response => console.log(response));
      });
  }

  private resetPoints() {
    for (const gamePlayerKey of this.gamePlayerKeys) {
      const gamePlayer = this.gamePlayers[gamePlayerKey];

      // to be moved
      const initialPointsScored = <PointsScored>{
        firstTeamTip: 0,
        secondTeamTip: 0,
        indirect: 0,
        total: 0,
        totalRounds: gamePlayer.pointsScored.totalRounds
      };
      gamePlayer.pointsScored = initialPointsScored;
      // use promise chained callback instead
    }
  }

  evaluate(): void {
    // Rewrite to not manipulate outer objects
    for (const gamePlayerKey of this.gamePlayerKeys) {
      const gamePlayer = this.gamePlayers[gamePlayerKey];

      const scoreOfFirstGuess = this.calculateScoresOfGuess(gamePlayer, gamePlayer.firstTeamTip);
      gamePlayer.pointsScored.firstTeamTip = scoreOfFirstGuess;

      const scoreOfSecondGuess = this.calculateScoresOfGuess(gamePlayer, gamePlayer.secondTeamTip);
      gamePlayer.pointsScored.secondTeamTip = scoreOfSecondGuess;

      gamePlayer.pointsScored.total += scoreOfFirstGuess + scoreOfSecondGuess;

      gamePlayer.pointsScored.totalRounds += gamePlayer.pointsScored.total;
    }
  }

  private calculateScoresOfGuess(currentGamePlayer: GamePlayer, teamTip: TeamTip): number {
    const firstTeamPlayer = this.gamePlayers[teamTip.firstPartner.uid];
    const secondTeamPlayer = this.gamePlayers[teamTip.secondPartner.uid];
    return this.calculatescoreService.calculateScoreForOneGuess(currentGamePlayer, firstTeamPlayer, secondTeamPlayer);
  }

  startNextRound() {
    this.router.navigate(['/firsttip', this.gameName]);
  }
}
