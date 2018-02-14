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
                this.fetchGamePlayersAndAssign(request.query.gameName);
                // TODO work with promise
                return response.status(200)
                    .send({
                        'status': 'SUCCESS'
                    });
            });
        });
    }


    // TODO return proper promise
    //@deprecated
    public fetchGamePlayersAndAssign(gameName: string): Promise<void>{
        return admin.firestore()
            .collection('games')
            .doc(gameName)
            .collection('players')
            .get()
            .then((results) => {
                const gamePlayers: GamePlayer[] = results.docs.map(player => {
                    return player.data();
                });
                console.log('assign triggered');
                // TODO return promise chain
                this.wordRoleAssignmentService.assign(gamePlayers, gameName);
            });
    }
}
