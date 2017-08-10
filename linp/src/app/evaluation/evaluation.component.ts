import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {ActivatedRoute} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {GamePlayer} from '../models/game';
import {Observable} from 'rxjs/Observable';
import {current} from "codelyzer/util/syntaxKind";

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
              public db: AngularFireDatabase,) {
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
      .map(gamePlayer => {

        const currentPlayerUid = gamePlayer[0];
        const gamePlayerObject = gamePlayer[1];

        const firstGuessFirstUidPartner = gamePlayerObject['firstTeamTip']['firstPartner']['uid'];
        const firstGuessSecondUidPartner = gamePlayerObject['firstTeamTip']['secondPartner']['uid'];
        this.calculateScoresOfGuess(currentPlayerUid, firstGuessFirstUidPartner, firstGuessSecondUidPartner);
        // reuse
        const secondGuessFirstUidPartner = gamePlayerObject['secondTeamTip']['firstPartner']['uid'];
        const secondGuessSecondUidPartner = gamePlayerObject['secondTeamTip']['secondPartner']['uid'];
        this.calculateScoresOfGuess(currentPlayerUid, secondGuessFirstUidPartner, secondGuessSecondUidPartner);

        return gamePlayer;
      }).subscribe(result => {
      console.log(result)
    });
  }

  private calculateScoresOfGuess(currentPlayerUid: any, firstGuessUID: string, secondGuessUID: string) {
    const isInitialValueSet = this.gamePlayers[currentPlayerUid].pointsScored.total;
    if (!isInitialValueSet) {
      this.gamePlayers[currentPlayerUid].pointsScored.total = 0;
    }

    const QUESTION_MARK = '?';
    const isFirstQuestionmark = this.gamePlayers[firstGuessUID].questionmarkOrWord === QUESTION_MARK;
    const isSecondQuestionmark = this.gamePlayers[firstGuessUID].questionmarkOrWord === QUESTION_MARK;

    const isWordsEqual = this.gamePlayers[firstGuessUID].questionmarkOrWord === this.gamePlayers[secondGuessUID].questionmarkOrWord;
    const isCorrectGuessOfTeamPartners = !isFirstQuestionmark && isWordsEqual;
    const himselfIncludedInGuess = currentPlayerUid === firstGuessUID || currentPlayerUid === secondGuessUID;

// Rewrite
    if (isCorrectGuessOfTeamPartners && !himselfIncludedInGuess) {
      this.gamePlayers[firstGuessUID].pointsScored.total -= 1;
      this.gamePlayers[currentPlayerUid].pointsScored.total += 1;
      this.gamePlayers[secondGuessUID].pointsScored.total -= 1;
      this.gamePlayers[currentPlayerUid].pointsScored.total += 1;
    }

    if (isCorrectGuessOfTeamPartners && himselfIncludedInGuess) {
      // actually useless
      const guessedHimselfAsFirstPartner = currentPlayerUid === firstGuessUID;
      const guessedHimselfAsSecondPartner = currentPlayerUid === secondGuessUID;
      const otherPartnerUid = guessedHimselfAsFirstPartner ? firstGuessUID : secondGuessUID;
      if (!guessedHimselfAsFirstPartner && !guessedHimselfAsSecondPartner) {
        throw Error('unexpected');
      }

      const thePartnerAlsoSelectedHimInFirstTeamguess = this.gamePlayers[otherPartnerUid].firstTeamTip.firstPartner.uid === currentPlayerUid;
      const andHimToBeHisPartnerInFirstTeamGuess = currentPlayerUid === this.gamePlayers[otherPartnerUid].firstTeamTip.firstPartner.uid
        || currentPlayerUid === this.gamePlayers[otherPartnerUid].firstTeamTip.secondPartner.uid;
      const andHimselfInFirstTeamGuess = otherPartnerUid === this.gamePlayers[otherPartnerUid].firstTeamTip.firstPartner.uid
        || otherPartnerUid === this.gamePlayers[otherPartnerUid].firstTeamTip.secondPartner.uid;

      const thePartnerAlsoSelectedHimInSecondTeamguess = this.gamePlayers[otherPartnerUid].secondTeamTip.firstPartner.uid === currentPlayerUid;
      const andHimToBeHisPartnerInSecondTeamGuess = currentPlayerUid === this.gamePlayers[otherPartnerUid].secondTeamTip.firstPartner.uid
        || currentPlayerUid === this.gamePlayers[otherPartnerUid].secondTeamTip.secondPartner.uid;
      const andHimselfInSecondTeamGuess = otherPartnerUid === this.gamePlayers[otherPartnerUid].secondTeamTip.firstPartner.uid
        || otherPartnerUid === this.gamePlayers[otherPartnerUid].secondTeamTip.secondPartner.uid;


      if (thePartnerAlsoSelectedHimInFirstTeamguess
        && andHimToBeHisPartnerInFirstTeamGuess
        && andHimselfInFirstTeamGuess) {
        this.gamePlayers[currentPlayerUid].pointsScored.total += 5;
      } else if (thePartnerAlsoSelectedHimInSecondTeamguess
        && andHimToBeHisPartnerInSecondTeamGuess
        && andHimselfInSecondTeamGuess) {
        this.gamePlayers[currentPlayerUid].pointsScored.total += 5;
      } else {
        // no points
      }
      return;
    }

    if (isFirstQuestionmark) {
      this.gamePlayers[currentPlayerUid].pointsScored.total -= 1;
      this.gamePlayers[firstGuessUID].pointsScored.total += 1;
    }
    if (isSecondQuestionmark) {
      this.gamePlayers[currentPlayerUid].pointsScored.total -= 1;
      this.gamePlayers[secondGuessUID].pointsScored.total += 1;
    }
  }
}
