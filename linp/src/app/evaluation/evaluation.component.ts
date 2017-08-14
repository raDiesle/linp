import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {GamePlayer} from '../models/game';
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

        const currentPlayerUid: string = <string>gamePlayerKeyValueObject[0];
        const gamePlayer: GamePlayer = <GamePlayer>gamePlayerKeyValueObject[1];
        // const currentGamePlayer = this.gamePlayers[currentPlayerUid];

        // first guess
        const firstGuessFirstUidPartner = gamePlayer.firstTeamTip.firstPartner.uid;
        const firstGuessSecondUidPartner = gamePlayer.firstTeamTip.secondPartner.uid;
        this.calculateScoresOfGuess(gamePlayer, firstGuessFirstUidPartner, firstGuessSecondUidPartner);
        // consider return score in function or consider points score to write, not total
        gamePlayer.pointsScored.firstTeamTip = gamePlayer.pointsScored.total;

        // second guess
        const secondGuessFirstUidPartner = gamePlayer.secondTeamTip.firstPartner.uid;
        const secondGuessSecondUidPartner = gamePlayer.secondTeamTip.secondPartner.uid;
        this.calculateScoresOfGuess(gamePlayer, secondGuessFirstUidPartner, secondGuessSecondUidPartner);
        gamePlayer.pointsScored.secondTeamTip = gamePlayer.pointsScored.total - gamePlayer.pointsScored.firstTeamTip;

        return gamePlayerKeyValueObject;
      }).subscribe(result => {
      // TODO
      console.log(result);
    });
  }

  private calculateScoresOfGuess(currentGamePlayer: GamePlayer, firstGuessUid: string, secondGuessUid: string) {

    const firstGuessGamePlayer = this.gamePlayers[firstGuessUid];
    const secondGuessGamePlayer = this.gamePlayers[secondGuessUid];

    // create on player create time. need to be set for all players at same time!
    currentGamePlayer.pointsScored.total = currentGamePlayer.pointsScored.total ? currentGamePlayer.pointsScored.total : 0;

    this.calculatescoreService.calculateScoreForOneGuess(currentGamePlayer, firstGuessGamePlayer, secondGuessGamePlayer);
  }
}
