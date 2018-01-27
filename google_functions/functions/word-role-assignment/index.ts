import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import {WordRoleAssignmentService} from './word-role-assignment.service';
import {GamePlayer, PointsScored, TeamTip} from '../../../linp/src/app/models/game';

const cors = require('cors')({origin: true});

export class WordRoleAssigment {

    wordRoleAssignmentService = new WordRoleAssignmentService();

    constructor() {
    }

    register() {
        return functions.https.onRequest((request, response) => {
            cors(request, response, () => {
                const gameRef = admin.firestore()
                    .collection('games')
                    .doc(request.query.gameName);
                // const gamePromise = gameRef.get();
                const gamePlayersPromise = gameRef
                    .collection('players')
                    .get()
                    .then((results) => {

                        // const gameName = results[0].name;
                        const gamePlayers: GamePlayer[] = results.docs.map(player => {
                            return player.data();
                        });
                        this.wordRoleAssignmentService.assign(gamePlayers, request.query.gameName);
                        return response.status(200)
                            .send({'status': 'SUCCESS'});
                    });
            });
        });
    }
}
