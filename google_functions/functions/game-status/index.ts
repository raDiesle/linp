import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Game, GamePlayer, GamePlayerStatus, GameStatus } from '../../../linp/src/app/models/game';
import { Evaluate } from './evaluate';
import { Preparegame } from './preparegame';
import { QuerySnapshot } from '@google-cloud/firestore';

export class GameStatusTrigger {

    evaluate = new Evaluate();
    preparegame = new Preparegame();

    constructor() {
    }

    public register() {
        return functions.firestore
            .document('games/{gameName}')
            .onUpdate((change, context) => {

                const gameName = (context.params as any).gameName as string;

                const newValue = change.after.data() as Game;
                const previousValue = change.before.data() as Game;
                const gameStatus = newValue.status;
                if (gameStatus === previousValue.status) {
                    return Promise.resolve();
                }

                const rulesMapping: { [gameStatus: string]: any } = {                    
                    'preparegame': (game: Game, name: string) => {
                        return this.updateHostToNoRequiredAction(game, gameName)
                            .then(() => {
                                return Promise.all([
                                    this.updateFirstPlayerToActionRequired(name),
                                    this.preparegame.perform(game, name)                                    
                                ])
                                .then(() => this.updateGameStatus('firsttip', gameName))
                            });
                    },
                    'firstguess': (game: Game, name: string) => this.updateAllPlayersToActionRequired(gameName),
                    'secondtip': (game: Game, name: string) => this.updateFirstPlayerToActionRequired(name),
                    'secondguess': (game: Game, name: string) => this.updateAllPlayersToActionRequired(gameName),
                    'evaluation': (game: Game, name: string) => {
                        return this.evaluate.performAllEvaluateStatusAction(game, name)                           
                        .then(() => {
                                return Promise.all([
                                    this.updateFirstPlayerToActionRequired(name)
                                    , this.preparegame.perform(game, name)
                                ])
                            });
                    },
                };

                const isARuleToBeApplied = Object.keys(rulesMapping).some(key => key === gameStatus);

                if (isARuleToBeApplied === false) {
                    return Promise.resolve();
                }

                // TODO return correct promise. might cancel execution !
                return rulesMapping[gameStatus](newValue, gameName);
            });
    }

    private updateGameStatus(nextStatus: GameStatus, gameName: string): Promise<any> {
        return admin.firestore()
            .collection('games')
            .doc(gameName)
            .update({
                status: nextStatus
            });
    }
    private updateHostToNoRequiredAction(game: Game, gameName: string): Promise<any> {
        return admin.firestore()
            .collection('players')
            .doc(game.host)
            .collection('activegames')
            .doc(gameName)
            .update({
                isActionRequired: false
            });
    }

    private updateFirstPlayerToActionRequired(gameName: string): Promise<any> {

        return admin.firestore()
            .collection('games')
            .doc(gameName)
            .collection('players')
            .get()
            .then((players: QuerySnapshot) => {
                let firstPlayerUid = this.getFirstPlayer(players);

                return admin.firestore()
                    .collection('players')
                    .doc(firstPlayerUid)
                    .collection('activegames')
                    .doc(gameName)
                    .update({
                        isActionRequired: true
                    })
                    .then(() => {
                        return Promise.resolve();
                    });
            });
    }

    private getFirstPlayer(players: FirebaseFirestore.QuerySnapshot) {
        let isFirstPlayerNotIdentified = true;
        let firstPlayerUid = "";
        players.forEach(player => {
            if (isFirstPlayerNotIdentified) {
                firstPlayerUid = player.data().uid;
                isFirstPlayerNotIdentified = false;
            }
        });
        return firstPlayerUid;
    }

    private updateAllPlayersToActionRequired(gameName: string): Promise<any> {
        return admin.firestore()
            .collection('games')
            .doc(gameName)
            .collection('players')
            .get()
            .then((players: QuerySnapshot) => {
                let promises: Promise<any>[] = [];
                players.forEach(player => {
                    const promise = admin.firestore()
                        .collection('players')
                        .doc(player.data().uid)
                        .collection('activegames')
                        .doc(gameName)
                        .update({
                            isActionRequired: true
                        });
                    promises.push(promise);
                });
                return promises;
            });

    }
}
