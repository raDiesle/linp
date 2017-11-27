import * as admin from 'firebase-admin';
import {GamePlayer} from '../../../linp/src/app/models/game';
import {RolesandwordsrequiredService} from './rolesandwordsrequired.service';

export class WordRoleAssignmentService {

    private rolesandWordsRequiredService = new RolesandwordsrequiredService();

    constructor() {
    }

    assign(gamePlayers: GamePlayer[], gameName: string) {
        const gamePlayerKeys = Object.keys(gamePlayers);
        const gamePlayerSize = gamePlayerKeys.length;

        const cardsNeededForGame = this.rolesandWordsRequiredService.getRolesNeeded(gamePlayerSize);
        const numberOfWordsNeeded: number = cardsNeededForGame.wordsNeeded;
        const numberOfQuestionMarks: number = cardsNeededForGame.questionMarksNeeded;

        const QUESTIONMARK_ROLE: { value: string } = {
            value: '?'
        };

        let questionmarkOrWordPool: { value: string }[] = Array(numberOfQuestionMarks).fill(QUESTIONMARK_ROLE);

        const language = 'de';
        const pathOrRef = '/words/size/' + language;

        admin.firestore()
            .collection('words')
            .doc(language)
            .get()
            .then(sizeObject => {
                console.log('size');
                console.log(new Date());
                const totalSizeOfWordCatalogue = sizeObject.data()['size'];

                const maxPosForStartPick = totalSizeOfWordCatalogue - numberOfWordsNeeded - 1;
                const startPickWordsAtPos = Math.floor((Math.random() * maxPosForStartPick) + 1);

                // TODO unused atm because not working
                const endPickWordsAtPos = startPickWordsAtPos + numberOfWordsNeeded - 1;

// query // might change to object. what if player adds word to database at same time with wrong primary key pos?
                // const randomID = admin.firestore().doc('dummy').id;

                admin.firestore()
                    .collection('words')
                    .doc(language)
                    .collection('cards')
                    .where('random', '<', this.generateRandomNumber())
                    .orderBy('random', 'desc')
                    .limit(numberOfWordsNeeded)
                    .get()
                    .then(wordsFullLibrary => {
                        console.log('wordsQuery');
                        console.log(new Date());
                        // optimize
                        const wordsChosenFromLibrary = wordsFullLibrary.docs.map(word => {
                            return {
                                value: word.data().value
                            };
                        });
                        // const wordsChosenFromLibrary = wordsFullLibrary.docs.splice(startPickWordsAtPos, numberOfWordsNeeded);

                        // duplicateToHaveTeamWords to distribute
                        const wordsDuplicatedForTeams = wordsChosenFromLibrary.concat(wordsChosenFromLibrary);
                        questionmarkOrWordPool = questionmarkOrWordPool.concat(wordsDuplicatedForTeams);

                        const shuffledWordPool = this.shuffle(questionmarkOrWordPool);
                        // TODO not nice, because lengths have to exactly match
                        if (gamePlayerKeys.length !== shuffledWordPool.length) {
                            const unexpectedPref = 'Unexpected error. Should match key length: ';
                            console.log(unexpectedPref + gamePlayerKeys.length + ' with wordPool: ' + shuffledWordPool.length);
                        }

                        let pos = 0;
                        gamePlayers.forEach(gamePlayer => {
                            gamePlayer.questionmarkOrWord = shuffledWordPool[pos]['value']; // fix value accessor
                            pos++;
                        });

                        return this.assignWordOrRoleToUserDB(gamePlayers, gameName);
                        // TODO animation

                        // was pos of navigate page before
                        // return null;
                    });
            });
    }

    private generateRandomNumber(): number {
        return Math.floor(Number.MAX_SAFE_INTEGER * (2 * (Math.random() - 0.5)));
    }

    private shuffle(arrayToSort: any[]): any[] {
        return arrayToSort.sort(function () {
            return Math.random() - 0.5;
        });
    };

    private assignWordOrRoleToUserDB(gamePlayers: GamePlayer[], gameName: string): Promise<any> {

        const batch = admin.firestore().batch();
        const playersRef = admin.firestore()
            .collection('games/')
            .doc(gameName)
            .collection('/players');

        gamePlayers.forEach(gamePlayer => {
            batch.set(playersRef.doc(gamePlayer.uid), gamePlayer);
        });
        return batch.commit();
    }
}
