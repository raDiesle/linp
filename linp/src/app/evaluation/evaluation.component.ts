import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {GamePlayer, TeamTip} from '../models/game';
import {Observable} from 'rxjs/Observable';
import {CalculatescoreService} from './calculatescore.service';

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
              public afAuth: AngularFireAuth,
              public db: AngularFireDatabase,
              private calculatescoreService: CalculatescoreService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
    this.db.object('/games/' + this.gameName + '/players')
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
        this.evaluate();
      });
  }

  evaluate(): void {

    // Rewrite to not manipulate outer objects
    Observable.pairs(this.gamePlayers)
      .flatMap(p => Observable.of(p))
      .map(gamePlayerKeyValueObject => {

        const gamePlayer: GamePlayer = <GamePlayer>gamePlayerKeyValueObject[1];

        const scoreOfFirstGuess = this.calculateScoresOfGuess(gamePlayer, gamePlayer.firstTeamTip);
        gamePlayer.pointsScored.firstTeamTip = scoreOfFirstGuess;

        const scoreOfSecondGuess = this.calculateScoresOfGuess(gamePlayer, gamePlayer.secondTeamTip);
        gamePlayer.pointsScored.secondTeamTip = scoreOfSecondGuess;

        gamePlayer.pointsScored.total += scoreOfFirstGuess + scoreOfSecondGuess;
        return gamePlayerKeyValueObject;
      }).subscribe(result => {
      // TODO
      console.log(result);
    });
  }

  private calculateScoresOfGuess(currentGamePlayer: GamePlayer, teamTip: TeamTip): number {
    const firstTeamPlayer = this.gamePlayers[teamTip.firstPartner.uid];
    const secondTeamPlayer = this.gamePlayers[teamTip.secondPartner.uid];
    return this.calculatescoreService.calculateScoreForOneGuess(currentGamePlayer, firstTeamPlayer, secondTeamPlayer);
  }
}
