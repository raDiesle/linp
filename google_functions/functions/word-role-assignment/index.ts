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
                    admin.database().ref('/games/' + request.query.gameName + '/players')
                        .once('value')
                        .then((gamePlayersSnapshot: any) => {
                            const gamePlayers: { [uid: string]: GamePlayer } = gamePlayersSnapshot.val();
                            this.wordRoleAssignmentService.assign(gamePlayers, request.query.gameName);
                            response.status(200)
                                .send('{status : "SUCCESS"}');
                        });
            });
        });
    }
}
