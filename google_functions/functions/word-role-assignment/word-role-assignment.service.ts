import * as admin from 'firebase-admin';
import {GamePlayer} from '../../../linp/src/app/models/game';
import {RolesandwordsrequiredService} from './rolesandwordsrequired.service';

export class WordRoleAssignmentService {

    private rolesandWordsRequiredService = new RolesandwordsrequiredService();
    constructor() {
    }

    assign(gamePlayers: { [uid: string]: GamePlayer }, gameName: string) {
        const gamePlayerKeys = Object.keys(gamePlayers);
        const gamePlayerSize = gamePlayerKeys.length;

        const cardsNeededForGame = this.rolesandWordsRequiredService.getRolesNeeded(gamePlayerSize);
        const numberOfWordsNeeded: number = cardsNeededForGame.wordsNeeded;
        const numberOfQuestionMarks: number = cardsNeededForGame.questionMarksNeeded;

        const QUESTIONMARK_ROLE = {
            value: '?'
        };

        let questionmarkOrWordPool: string[] = Array(numberOfQuestionMarks).fill(QUESTIONMARK_ROLE);

        const language = 'en';
        const pathOrRef = '/words/size/' + language;
        admin.database()
            .ref(pathOrRef)
            .once('value')
            .then(totalSizeOfWordsDuplicatedReference => {
                const totalSizeOfWordCatalogue = totalSizeOfWordsDuplicatedReference.val();

                const maxPosForStartPick = totalSizeOfWordCatalogue - numberOfWordsNeeded - 1;
                const startPickWordsAtPos = Math.floor((Math.random() * maxPosForStartPick) + 1);

                // TODO unused atm because not working
                const endPickWordsAtPos = startPickWordsAtPos + numberOfWordsNeeded - 1;

// query // might change to object. what if player adds word to database at same time with wrong primary key pos?
                admin.database()
                    .ref('/words/' + language)
                    .once('value')
                    .then(wordsFullLibrary => {
                        // optimize
                        const wordsChosenFromLibrary = wordsFullLibrary.val().splice(startPickWordsAtPos, numberOfWordsNeeded);
                        const wordsDuplicatedForTeams = wordsChosenFromLibrary.concat(wordsChosenFromLibrary);
                        questionmarkOrWordPool = questionmarkOrWordPool.concat(wordsDuplicatedForTeams);

                        const shuffledWordPool = this.shuffle(questionmarkOrWordPool);
                        // TODO not nice, because lengths have to exactly match
                        if (gamePlayerKeys.length !== shuffledWordPool.length) {
                            console.log('Unexpected error. Should match key length: ' + gamePlayerKeys.length + ' with wordPool: ' + shuffledWordPool.length);
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

    private assignWordOrRoleToUserDB(gamePlayers: { [uid: string]: GamePlayer }, gameName: string): void {
        admin.database()
            .ref('games/' + gameName + '/players')
            .set(gamePlayers);
    }
}
