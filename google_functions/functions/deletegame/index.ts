import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import {GamePlayer, PointsScored, TeamTip} from '../../../linp/src/app/models/game';

const cors = require('cors')({origin: true});

export class DeleteGame {

    constructor() {
    }

    register() {
        return functions.https.onRequest((request, response) => {
                cors(request, response, () => {
                    const gameRef = admin.firestore()
                        .collection('games')
                        .doc(request.query.gameName)
                        .delete()
                        .then(() => {
                            return response.status(200)
                                .send({'status': 'SUCCESS'});
                        });
                });
            }
        );
    }
}
