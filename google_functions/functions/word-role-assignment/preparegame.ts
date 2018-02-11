import * as admin from 'firebase-admin';
import {Game, GamePlayer} from '../../../linp/src/app/models/game';
import * as firebase from 'firebase';
import {WriteResult} from '@google-cloud/firestore';
import {WordRoleAssigment} from './index';

export class Preparegame {

    constructor() {

    }

    public perform(game: Game, gameName: string): Promise<WriteResult[]> | Promise<void> {

        // not null or undefined
        const isResetOnPlayersNeededOnFurtherRounds = game.pointsScoredTotal;
        if (!isResetOnPlayersNeededOnFurtherRounds) {
            new WordRoleAssigment().fetchGamePlayersAndAssign(gameName);
            // TODO return proper promise
            return Promise.resolve();
        }

        const batch = admin.firestore().batch();
        const gamePlayerIds = Object.keys(game.pointsScoredTotal);

        const reference = admin.firestore()
            .collection('games')
            .doc(gameName)
            .collection('players');
        gamePlayerIds.forEach(gamePlayerId => {
            batch.update(reference.doc(gamePlayerId), this.getResetPlayerModel());
        });

        const promise = batch.commit();
        promise.then(() => {
            // TODO return promise
            new WordRoleAssigment().fetchGamePlayersAndAssign(gameName);
        });

        // TODO return assignment promise
        return promise;
    }

    public getResetPlayerModel() {
        const requestModel: any = {
            ['firstSynonym']: firebase.firestore.FieldValue.delete(),
            ['firstTeamTip']: firebase.firestore.FieldValue.delete(),
            ['pointsScored']: firebase.firestore.FieldValue.delete(),
            /*
              {
            ['firstTeamTip']: firebase.firestore.FieldValue.delete(),
              ['indirect']: firebase.firestore.FieldValue.delete(),
              ['secondTeamTip']: firebase.firestore.FieldValue.delete(),
              ['total']: firebase.firestore.FieldValue.delete(),
              // totalRounds
            },
            */
            ['questionmarkOrWord']: firebase.firestore.FieldValue.delete(),
            ['secondSynonym']: firebase.firestore.FieldValue.delete(),
            ['secondTeamTip']: firebase.firestore.FieldValue.delete(),
            // ['status']: 'READY_TO_START',
            ['totalRanking']: firebase.firestore.FieldValue.delete()
        };
        return requestModel;
    }

}
