import {Injectable} from '@angular/core';
import {GamePlayer} from '../models/game';
import {FirebaseListFactoryOpts} from 'angularfire2/database/interfaces';
import {AngularFireDatabase} from 'angularfire2/database';

@Injectable()
export class WordRoleAssignmentService {

  constructor(public db: AngularFireDatabase) {
  }

  assign(gamePlayerKeys: string[], gamePlayers: { [uid: string]: GamePlayer }, gameName: string) {
    let numberOfWordsNeeded: number;
    let numberOfQuestionMarks: number;

    // expecting minimum 4
    const gamePlayerSize = gamePlayerKeys.length;
    switch (true) {
      case (gamePlayerSize <= 5):
        numberOfQuestionMarks = 1;
        numberOfWordsNeeded = 2;
        break;
      // for later refactoring explicit
      case(gamePlayerSize > 5 && gamePlayerSize <= 8):
        numberOfQuestionMarks = 2;
        numberOfWordsNeeded = (gamePlayerSize - numberOfQuestionMarks) / 2;
        break;
      default:
        alert('Player size not expected');
    }
    const QUESTIONMARK_ROLE = {
      value: '?'
    };

    let questionmarkOrWordPool: string[] = Array(numberOfQuestionMarks).fill(QUESTIONMARK_ROLE);

    const language = 'en';
    const pathOrRef = '/words/size/' + language;
    this.db.object(pathOrRef, {preserveSnapshot: true})
      .subscribe(totalSizeOfWordsDuplicatedReference => {
        const totalSizeOfWordCatalogue = totalSizeOfWordsDuplicatedReference.val();

        const maxPosForStartPick = totalSizeOfWordCatalogue - numberOfWordsNeeded - 1;
        const startPickWordsAtPos = Math.floor((Math.random() * maxPosForStartPick) + 1);

        // TODO unused atm because not working
        const endPickWordsAtPos = startPickWordsAtPos + numberOfWordsNeeded - 1;
        const query: FirebaseListFactoryOpts = {
          query: {
            startAt: startPickWordsAtPos,
            endAt: endPickWordsAtPos
          }
        };

// query // might change to object. what if player adds word to database at same time with wrong primary key pos?
        this.db.list('/words/' + language)
          .subscribe(wordsFullLibrary => {
            // optimize
            const wordsChosenFromLibrary = wordsFullLibrary.splice(startPickWordsAtPos, numberOfWordsNeeded);
            const wordsDuplicatedForTeams = wordsChosenFromLibrary.concat(wordsChosenFromLibrary);
            questionmarkOrWordPool = questionmarkOrWordPool.concat(wordsDuplicatedForTeams);

            const shuffledWordPool = this.shuffle(questionmarkOrWordPool);
            // TODO not nice, because lengths have to exactly match
            if (gamePlayerKeys.length !== shuffledWordPool.length) {
              alert('Unexpected error. Should match key length: ' + gamePlayerKeys.length + ' with wordPool: ' + shuffledWordPool.length);
            }
            for (let pos = 0; pos < gamePlayerKeys.length; pos++) {
              gamePlayers[gamePlayerKeys[pos]].questionmarkOrWord = shuffledWordPool[pos]['value']; // fix value accessor
            }
            this.assignWordOrRoleToUserDB(gamePlayers, gameName);
            // TODO animation

            // was pos of navigate page before
            return null;
          });
      });
  }

  private shuffle(arrayToSort: any[]): any[] {
    return arrayToSort.sort(function () {
      return Math.random() - 0.5;
    });
  };

  private assignWordOrRoleToUserDB(players, gameName: string): void {
    this.db.object('games/' + gameName + '/players')
      .set(players);
  }
}
