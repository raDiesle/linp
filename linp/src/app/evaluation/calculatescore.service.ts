import {Injectable} from '@angular/core';
import {GamePlayer} from "../models/game";

@Injectable()
export class CalculatescoreService {

  constructor() {
  }

  calculateScoreForOneGuess(currentGamePlayer: GamePlayer, firstGuessGamePlayer: GamePlayer, secondGuessGamePlayer: GamePlayer) {

    this.performQuestionmarkRule(firstGuessGamePlayer, currentGamePlayer, secondGuessGamePlayer);

    const isWordsEqual = firstGuessGamePlayer.questionmarkOrWord === secondGuessGamePlayer.questionmarkOrWord;
    const isCorrectGuessOfTeamPartners = (firstGuessGamePlayer.questionmarkOrWord !== '?') && isWordsEqual;
    const himselfIncludedInGuess = currentGamePlayer.uid === firstGuessGamePlayer.uid || currentGamePlayer.uid === secondGuessGamePlayer.uid;

// Rewrite
    const identifiedOtherTeamCorrect = isCorrectGuessOfTeamPartners && !himselfIncludedInGuess;
    if (identifiedOtherTeamCorrect) {
      this.shiftPointsFromPlayerToPlayer(firstGuessGamePlayer, currentGamePlayer, 1);
      this.shiftPointsFromPlayerToPlayer(secondGuessGamePlayer, currentGamePlayer, 1);
    }

    const isGuessedAsTeammate = isCorrectGuessOfTeamPartners && himselfIncludedInGuess;
    if (isGuessedAsTeammate) {
      const guessedHimselfAsFirstPartner = currentGamePlayer.uid === firstGuessGamePlayer.uid;
      const otherPartner = guessedHimselfAsFirstPartner ? secondGuessGamePlayer : firstGuessGamePlayer;
      const isFoundPartnerBySecondGuess = this.isOtherPlayerGuessedAsTeamCorrect(otherPartner, currentGamePlayer, 'secondTeamTip');
      const isFoundPartnerByFirstGuess = this.isOtherPlayerGuessedAsTeamCorrect(otherPartner, currentGamePlayer, 'firstTeamTip');
      if (isFoundPartnerByFirstGuess || isFoundPartnerBySecondGuess) {
        currentGamePlayer.pointsScored.total += 5
      }
    }
  }

  private isOtherPlayerGuessedAsTeamCorrect(otherPartner: GamePlayer,
                                            currentGamePlayer: GamePlayer,
                                            firstOrSecondTeamTip: 'firstTeamTip' | 'secondTeamTip') {

    const thePartnerAlsoSelectedHimTeamguess = otherPartner[firstOrSecondTeamTip].firstPartner.uid === currentGamePlayer.uid;
    const andHimToBeHisPartner = thePartnerAlsoSelectedHimTeamguess
      || currentGamePlayer.uid === otherPartner[firstOrSecondTeamTip].secondPartner.uid;
    const andHimself = otherPartner.uid === otherPartner[firstOrSecondTeamTip].firstPartner.uid
      || otherPartner.uid === otherPartner[firstOrSecondTeamTip].secondPartner.uid;


    return (thePartnerAlsoSelectedHimTeamguess
      && andHimToBeHisPartner
      && andHimself);
  }

  private

  performQuestionmarkRule(firstGuessGamePlayer: GamePlayer, currentGamePlayer: GamePlayer, secondGuessGamePlayer: GamePlayer) {
    const QUESTION_MARK = '?';
    if (firstGuessGamePlayer.questionmarkOrWord === QUESTION_MARK) {
      this.shiftPointsFromPlayerToPlayer(currentGamePlayer, firstGuessGamePlayer, 1);
    }
    if (secondGuessGamePlayer.questionmarkOrWord === QUESTION_MARK) {
      this.shiftPointsFromPlayerToPlayer(currentGamePlayer, secondGuessGamePlayer, 1);
    }
  }

  private

  shiftPointsFromPlayerToPlayer(fromPlayer: GamePlayer, toPlayer: GamePlayer, points: number) {
    fromPlayer.pointsScored.total -= points;
    toPlayer.pointsScored.total += points;
  }
}
