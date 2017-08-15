import {Injectable} from '@angular/core';
import {GamePlayer} from '../models/game';

@Injectable()
export class CalculatescoreService {

  constructor() {
  }

  calculateScoreForOneGuess(currentGamePlayer: GamePlayer, firstGuessGamePlayer: GamePlayer, secondGuessGamePlayer: GamePlayer) {

    const wasAnyoneQuestionmark = this.performQuestionmarkRule(firstGuessGamePlayer, currentGamePlayer, secondGuessGamePlayer);
    if (wasAnyoneQuestionmark) {
      return;
    }

    const isWordsEqual = firstGuessGamePlayer.questionmarkOrWord === secondGuessGamePlayer.questionmarkOrWord;
    const isCorrectGuessOfTeamPartners = (firstGuessGamePlayer.questionmarkOrWord !== '?') && isWordsEqual;
    const himselfIncludedInGuess = currentGamePlayer.uid === firstGuessGamePlayer.uid || currentGamePlayer.uid === secondGuessGamePlayer.uid;

// Rewrite
    const identifiedOtherTeamCorrect = isCorrectGuessOfTeamPartners && !himselfIncludedInGuess;
    if (identifiedOtherTeamCorrect) {
      firstGuessGamePlayer.pointsScored.indirect -= 1;
      firstGuessGamePlayer.pointsScored.total -= 1;
      currentGamePlayer.pointsScored.total += 1;

      secondGuessGamePlayer.pointsScored.indirect -= 1;
      secondGuessGamePlayer.pointsScored.total -= 1;
      currentGamePlayer.pointsScored.total += 1;
      return;
    }

    const isGuessedAsTeammate = isCorrectGuessOfTeamPartners && himselfIncludedInGuess;
    if (isGuessedAsTeammate && this.isCorrectGuessOfTeamPartners(currentGamePlayer, firstGuessGamePlayer, secondGuessGamePlayer)) {
      currentGamePlayer.pointsScored.total += 5;
    }
  }

  private isCorrectGuessOfTeamPartners(currentGamePlayer: GamePlayer, firstGuessGamePlayer: GamePlayer, secondGuessGamePlayer: GamePlayer) {
    const guessedHimselfAsFirstPartner = currentGamePlayer.uid === firstGuessGamePlayer.uid;
    const otherPartner = guessedHimselfAsFirstPartner ? secondGuessGamePlayer : firstGuessGamePlayer;
    const isFoundPartnerBySecondGuess = this.isOtherPlayerGuessedAsTeamCorrect(otherPartner, currentGamePlayer, 'secondTeamTip');
    const isFoundPartnerByFirstGuess = this.isOtherPlayerGuessedAsTeamCorrect(otherPartner, currentGamePlayer, 'firstTeamTip');
    const isCorrectMatchWithPartner = isFoundPartnerByFirstGuess || isFoundPartnerBySecondGuess;
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
    const QUESTION_MARK = '?';
    let wasAnyoneWasQuestionMark = false;
    if (firstGuessGamePlayer.questionmarkOrWord === QUESTION_MARK) {
      wasAnyoneWasQuestionMark = true;
      currentGamePlayer.pointsScored.total -= 1;
      firstGuessGamePlayer.pointsScored.indirect += 1;
      firstGuessGamePlayer.pointsScored.total += 1;
    }
    if (secondGuessGamePlayer.questionmarkOrWord === QUESTION_MARK) {
      wasAnyoneWasQuestionMark = true;
      currentGamePlayer.pointsScored.total -= 1;
      secondGuessGamePlayer.pointsScored.indirect += 1;
      secondGuessGamePlayer.pointsScored.total += 1;
    }

    return wasAnyoneWasQuestionMark;
  }

  /*
  private shiftPointsFromPlayerToPlayer(currentFromPlayer: GamePlayer, indirectToPlayer: GamePlayer, points: number) {
    currentFromPlayer.pointsScored.total -= points;
    indirectToPlayer.pointsScored.indirect += points;
  }
  */
}
