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
                const gameName = (event.params as any).gameName as string;

                const newValue = event.data.data() as GamePlayer;
                const playerStatus = newValue.status;
                const previousValue = event.data.previous.data() as GamePlayer;
                if (newValue.status === previousValue.status) {
                    return Promise.resolve();
                }

                const newGameStatusMapping: {[status: string]: GameStatus} = {
                  
                    'READY_TO_START' : 'firsttip',
                    'FIRST_SYNONYM_GIVEN' : 'secondguess',
                    'SECOND_GUESS_GIVEN' : 'evaluation',
                    'CHECKED_EVALUATION' : 'finalizeround',
                };

                const rulesToApplyNewGameStatus =
                    Object.keys(newGameStatusMapping).some(status => status === playerStatus)
                if (rulesToApplyNewGameStatus === false) {
                    // TODO return promise instead
                    return Promise.resolve();
                }

                return admin.firestore()
                    .collection('games')
                    .doc(gameName)
                    .collection('players')
                    .get()
                    .then(players => {
                        let countPlayersWithNewStatus = 0;
                        players.forEach((player) => {
                            if (player.data().status === newValue.status) {
                                countPlayersWithNewStatus++;
                            }
                        });
                        const isNewGameState = countPlayersWithNewStatus === players.size;

                        if (isNewGameState) {
                            // typing
                            const newGameStatus = newGameStatusMapping[playerStatus];
                            return admin.firestore()
                                .collection('games')
                                .doc(gameName)
                                .update({
                                    status: newGameStatus
                                }).then(() => {
                                    // do something
                                });
                        }
                        return Promise.resolve();
                    });
            });
    }
}
