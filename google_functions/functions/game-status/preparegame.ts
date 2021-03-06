import { LANGUAGE } from './../../../linp/src/app/models/context';
import * as admin from 'firebase-admin';
import { Game, GamePlayer, PlayerRolesCounts } from '../../../linp/src/app/models/game';
import * as firebase from 'firebase';
import { WriteResult, QuerySnapshot } from '@google-cloud/firestore';
import { firestore } from 'firebase-functions';
import { PrepareGameRuleset } from './preparegameRuleset';

export class Preparegame {

    private prepareGameRuleset = new PrepareGameRuleset();
    readonly NEXT_STATUS = 'firsttip';

    constructor() {
    }

    public perform(game: Game, gameName: string): Promise<any> {
        // TODO return assignment promise

        const reference = admin.firestore()
            .collection('games')
            .doc(gameName)
            .collection('players');
        const playersPromise = reference.get();

        const promise = playersPromise
            .then((results: QuerySnapshot) => {
                const gamePlayers: GamePlayer[] = results.docs.map(player => player.data());

                let resetPromise: Promise<any> = Promise.resolve();
                if (game.round > 0) {
                    console.info("reset");
                    const batch = admin.firestore().batch();
                    const gamePlayerIds = gamePlayers.map(gamePlayer => gamePlayer.uid);
                    gamePlayerIds.forEach(gamePlayerId => {
                        batch.update(reference.doc(gamePlayerId), this.getResetPlayerModel());
                    });
                    resetPromise = batch.commit();
                }

                return resetPromise.then(() => {
                    console.log("assign");
                    return this.assignRolesOrWords(gamePlayers, gameName, game.language);
                });
            });
        return promise;
    }

    public getResetPlayerModel() {

        const requestModel: any = {
            ['firstSynonym'] : admin.firestore.FieldValue.delete(),
            ['firstTeamTip']: admin.firestore.FieldValue.delete(),
            ['pointsScored']: admin.firestore.FieldValue.delete(),
            /*
              {
            ['firstTeamTip']: firebase.firestore.FieldValue.delete(),
              ['indirect']: firebase.firestore.FieldValue.delete(),
              ['secondTeamTip']: firebase.firestore.FieldValue.delete(),
              ['total']: firebase.firestore.FieldValue.delete(),
              // totalRounds
            },
            */
            ['questionmarkOrWord']: admin.firestore.FieldValue.delete(),
            ['secondSynonym']: admin.firestore.FieldValue.delete(),
            ['secondTeamTip']: admin.firestore.FieldValue.delete(),
            // ['status']: 'READY_TO_START',

            // TODO actually obsolete
            ['totalRanking']: admin.firestore.FieldValue.delete()
        };
        return requestModel;
    }

    assignRolesOrWords(gamePlayers: GamePlayer[], gameName: string, language: LANGUAGE): Promise<any> {
        const gamePlayerKeys = Object.keys(gamePlayers);
        const gamePlayerSize = gamePlayerKeys.length;

        const cardsNeededForGame = this.prepareGameRuleset.getRolesNeeded(gamePlayerSize);
        const numberOfWordsNeeded: number = cardsNeededForGame.wordsNeeded;
        const numberOfQuestionMarks: number = cardsNeededForGame.questionMarksNeeded;

        const rolesInformation: PlayerRolesCounts = {
            total: gamePlayerSize,
            questionmark: numberOfQuestionMarks,
            words: numberOfWordsNeeded
        };
        const gameRolesWrittenPromise = this.writeRolesRequiredToGame(rolesInformation, gameName);

        return Promise.all([gameRolesWrittenPromise, this.fetchWordsAndAssignRoles(rolesInformation, gamePlayers, gameName, language)]);
    }

    private fetchWordsAndAssignRoles(rolesInformation: PlayerRolesCounts, gamePlayers: GamePlayer[], gameName: string, language: LANGUAGE): Promise<void> {
        const numberOfQuestionMarks = rolesInformation.questionmark;
        const numberOfWordsNeeded: number = rolesInformation.words;

        const QUESTIONMARK_ROLE: { value: string } = {
            value: '?'
        };

        let questionmarkOrWordPool: { value: string }[] = Array(numberOfQuestionMarks).fill(QUESTIONMARK_ROLE);

        const pathOrRef = '/words/size/' + language;

        return admin.firestore()
            .collection('words')
            .doc(language)
            .get()
            .then(sizeObject => {
                const totalSizeOfWordCatalogue = sizeObject.data()['size'];

                const maxPosForStartPick = totalSizeOfWordCatalogue - numberOfWordsNeeded - 1;
                const startPickWordsAtPos = Math.floor((Math.random() * maxPosForStartPick) + 1);

                // TODO unused atm because not working
                const endPickWordsAtPos = startPickWordsAtPos + numberOfWordsNeeded - 1;

                // query // might change to object. what if player adds word to database at same time with wrong primary key pos?
                // const randomID = admin.firestore().doc('dummy').id;

                return admin.firestore()
                    .collection('words')
                    .doc(language)
                    .collection('cards')
                    .where('random', '<', this.generateRandomNumber())
                    .orderBy('random', 'desc')
                    .limit(numberOfWordsNeeded)
                    .get()
                    .then(wordsFullLibrary => {
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
                        if (gamePlayers.length !== shuffledWordPool.length) {
                            const unexpectedPref = 'Unexpected error. Should match key length: ';
                            console.log(unexpectedPref + gamePlayers.length + ' with wordPool: ' + shuffledWordPool.length);
                        }

                        let pos = 0;
                        // TODO use batch for promise                        
                        gamePlayers.forEach(gamePlayer => {
                            gamePlayer.questionmarkOrWord = shuffledWordPool[pos]['value']; // fix value accessor
                            pos++;
                        });

                        return this.assignWordOrRoleToUserDB(gamePlayers, gameName);
                    });
            });
    }

    private writeRolesRequiredToGame(rolesInformation: PlayerRolesCounts, gameName: string): Promise<WriteResult> {
        return admin.firestore()
            .collection('games')
            .doc(gameName)
            .update({
                playerRolesCounts: rolesInformation
            })
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
            .collection('games')
            .doc(gameName)
            .collection('players');

        gamePlayers.forEach(gamePlayer => {
            const gamePlayerUpdate = {
                questionmarkOrWord : gamePlayer.questionmarkOrWord
            };
            batch.update(playersRef.doc(gamePlayer.uid), gamePlayerUpdate);
        });
        return batch.commit();
    }

}
