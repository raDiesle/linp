import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {GamePlayer, GamePlayerStatus, GameStatus} from '../../../linp/src/app/models/game';

export class PlayerStatusTrigger {

    constructor() {

    }

    public register() {
        return functions.firestore
            .document('games/{gameName}/players/{uid}')
            .onUpdate(event => {

                // Get an object representing the document
                // e.g. {'name': 'Marie', 'age': 66}
                const newValue = event.data.data();

                // ...or the previous value before this update
                const previousValue = event.data.previous.data();

                // access a particular field as you would any JS property
                const name = newValue.name;


                // console.log(newValue);
                // console.log(gameName);
                // console.log(playerStatus);

                const gameName = (event.params as any).gameName as string;
                const playerStatus = newValue.status as GamePlayerStatus;

                const rulesToSkipApplyNewGameStatus = playerStatus !== 'SECOND_GUESS_GIVEN';
                if (rulesToSkipApplyNewGameStatus) {
                    // TODO return promise instead
                    return Promise.resolve();
                }

                return admin.firestore()
                    .collection('games')
                    .doc(gameName)
                    .collection('players')
                    // .where('status', '==', playerStatus)
                    .get()
                    .then(players => {
                        let countPlayersWithNewStatus = 0;
                        players.forEach(function (player) {
                            if (player.data().status === playerStatus) {
                                countPlayersWithNewStatus++;
                            }
                        });
                        const isNewGameState = countPlayersWithNewStatus === players.size;

                        if (isNewGameState) {
                            return admin.firestore()
                                .collection('games')
                                .doc(gameName)
                                .update({
                                    status: 'evaluation' as GameStatus
                                }).then(() => {
                                });
                        }
                        return Promise.resolve();
                    });

                // 'games/' + gameName + '/status'
            });
    }
}
