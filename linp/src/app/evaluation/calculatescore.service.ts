import {Injectable} from '@angular/core';
import {GamePlayer} from '../models/game';

@Injectable()
export class CalculatescoreService {

  constructor() {
  }

  calculateScoreForOneGuess(currentGamePlayer: GamePlayer, firstGuessGamePlayer: GamePlayer, secondGuessGamePlayer: GamePlayer): number {

    const currentPlayerQuestionScore = this.performQuestionmarkRule(firstGuessGamePlayer, currentGamePlayer, secondGuessGamePlayer);
    if (currentPlayerQuestionScore < 0) {
      return currentPlayerQuestionScore;
    }

    const isWordsEqual = firstGuessGamePlayer.questionmarkOrWord === secondGuessGamePlayer.questionmarkOrWord;
    const isCorrectGuessOfTeamPartners = (firstGuessGamePlayer.questionmarkOrWord !== '?') && isWordsEqual;
    const himselfIncludedInGuess = currentGamePlayer.uid === firstGuessGamePlayer.uid || currentGamePlayer.uid === secondGuessGamePlayer.uid;

// Rewrite
    const identifiedOtherTeamCorrect = isCorrectGuessOfTeamPartners && !himselfIncludedInGuess;
    if (identifiedOtherTeamCorrect) {
      firstGuessGamePlayer.pointsScored.indirect -= 1;
      firstGuessGamePlayer.pointsScored.total -= 1;

      secondGuessGamePlayer.pointsScored.indirect -= 1;
      secondGuessGamePlayer.pointsScored.total -= 1;

      return 2;
    }

    const isGuessedAsTeammate = isCorrectGuessOfTeamPartners && himselfIncludedInGuess;
    if (isGuessedAsTeammate && this.isCorrectGuessOfTeamPartners(currentGamePlayer, firstGuessGamePlayer, secondGuessGamePlayer)) {
      return 5;
    }

    return 0;
  }

  private isCorrectGuessOfTeamPartners(currentGamePlayer: GamePlayer, firstGuessGamePlayer: GamePlayer, secondGuessGamePlayer: GamePlayer) {
    const guessedHimselfAsFirstPartner = currentGamePlayer.uid === firstGuessGamePlayer.uid;
    const otherPartner = guessedHimselfAsFirstPartner ? secondGuessGamePlayer : firstGuessGamePlayer;
    const isFoundPartnerBySecondGuess = this.isOtherPlayerGuessedAsTeamCorrect(otherPartner, currentGamePlayer, 'secondTeamTip');
    const isFoundPartnerByFirstGuess = this.isOtherPlayerGuessedAsTeamCorrect(otherPartner, currentGamePlayer, 'firstTeamTip');
    const isCorrectMatchWithPartner = isFoundPartnerByFirstGuess || isFoundPartnerBySecondGuess;
    return isCorrectMatchWithPartner;
  }

  private isOtherPlayerGuessedAsTeamCorrect(otherPartner: GamePlayer,
                                            currentGamePlayer: GamePlayer,
                                            firstOrSecondTeamTip: 'firstTeamTip' | 'secondTeamTip') {

    const thePartnerAlsoSelectedHimTeamguess = otherPartner[firstOrSecondTeamTip].firstPartner.uid === currentGamePlayer.uid;
    const andHimToBeHisPartner = thePartnerAlsoSelectedHimTeamguess
      || currentGamePlayer.uid === otherPartner[firstOrSecondTeamTip].secondPartner.uid;
    const andHimself = otherPartner.uid === otherPartner[firstOrSecondTeamTip].firstPartner.uid
      || otherPartner.uid === otherPartner[firstOrSecondTeamTip].secondPartner.uid;

    const isOtherPlayerGuessedAsTeamCorrect = (thePartnerAlsoSelectedHimTeamguess
      && andHimToBeHisPartner
      && andHimself);
    return isOtherPlayerGuessedAsTeamCorrect;
  }

  private performQuestionmarkRule(firstGuessGamePlayer: GamePlayer, currentGamePlayer: GamePlayer, secondGuessGamePlayer: GamePlayer) {
    let pointsForChoosingQuestionmark = 0;

    const QUESTION_MARK = '?';
    if (firstGuessGamePlayer.questionmarkOrWord === QUESTION_MARK) {
      firstGuessGamePlayer.pointsScored.indirect += 1;
      firstGuessGamePlayer.pointsScored.total += 1;
      pointsForChoosingQuestionmark -= 1;
    }
    if (secondGuessGamePlayer.questionmarkOrWord === QUESTION_MARK) {
      secondGuessGamePlayer.pointsScored.indirect += 1;
      secondGuessGamePlayer.pointsScored.total += 1;
      pointsForChoosingQuestionmark -= 1;
    }

    return pointsForChoosingQuestionmark;
  }
}
