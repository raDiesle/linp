import * as admin from 'firebase-admin';
import {Game, GamePlayer} from '../../../linp/src/app/models/game';
import * as firebase from 'firebase';
import {WriteResult} from '@google-cloud/firestore';
import {WordRoleAssigment} from './index';
import { WordRoleAssignmentService } from './word-role-assignment.service';

export class Preparegame {

    wordRoleAssignmentService = new WordRoleAssignmentService();

    constructor() {        
    }

    public perform(game: Game, gameName: string): Promise<WriteResult[]> | Promise<void> {

/*
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
*/
        // TODO return assignment promise
        
        console.log('start to preparegame');
        
        const reference = admin.firestore()
            .collection('games')
            .doc(gameName)
            .collection('players');
        const playersPromise = reference.get();

        const promise = playersPromise.then((results) => {
            const gamePlayers: GamePlayer[] = results.docs.map(player => {
                return player.data();
            });
            const gamePlayerIds = gamePlayers.map(gamePlayer => gamePlayer.uid);             

            let resetPromise: Promise<any> = Promise.resolve();
            if(game.round > 0){
                const batch = admin.firestore().batch();
                gamePlayerIds.forEach(gamePlayerId => {
                    batch.update(reference.doc(gamePlayerId), this.getResetPlayerModel());    
                });
                resetPromise = batch.commit();
            }

            console.log('assign triggered');
            
            resetPromise.then(() => {
                // TODO return promise chain
                this.wordRoleAssignmentService.assign(gamePlayers, gameName);
            });        
        });

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
