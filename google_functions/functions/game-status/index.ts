import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {Game, GamePlayer, GamePlayerStatus, GameStatus} from '../../../linp/src/app/models/game';
import {Evaluate} from './evaluate';
import {Preparegame} from './preparegame';

export class GameStatusTrigger {

    evaluate = new Evaluate();
    preparegame = new Preparegame();
    
    constructor() {
    }

    public register() {
        return functions.firestore
            .document('games/{gameName}')
            .onUpdate(event => {
                console.info('change game event');
                const gameName = (event.params as any).gameName as string;

                const newValue = event.data.data() as Game;
                const previousValue = event.data.previous.data() as Game;
                const gameStatus = newValue.status;
                if (gameStatus === previousValue.status) {
                    return Promise.resolve();
                }

                const rulesMapping: { [gameStatus: string]: any } = {
                    'evaluation': (game: Game, name: string) => this.evaluate.performAllEvaluateStatusAction(game, name),
                    'preparegame': (game: Game, name: string) => {
                        console.info('preparegame');
                        return Promise.all([
                            this.updateFirstPlayerToActionRequired(name),
                            this.preparegame.perform(game, name)
                        ])        
                    },
                    'firstguess': (game: Game, name: string) => this.updateAllPlayersToActionRequired(gameName),
                    'secondtip' : (game: Game, name: string) => this.updateFirstPlayerToActionRequired(name),
                    'secondguess': (game: Game, name: string) => this.updateAllPlayersToActionRequired(gameName)
                };

                const isARuleToBeApplied = Object.keys(rulesMapping).some(key => key === gameStatus);
                
                if (isARuleToBeApplied === false) {
                    return Promise.resolve();
                }

                // TODO return correct promise. might cancel execution !
                return rulesMapping[gameStatus](newValue, gameName);
            });
    }

    private updateFirstPlayerToActionRequired(gameName: string): Promise<any> {
        console.info('triggered required');
        return admin.firestore()
        .collection('games')
        .doc(gameName)
        .collection('players')
        .get()
        .then(players => {
            const isFirstPlayerNotIdentified = true;
            let firstPlayerUid = "";
            players.forEach(player => {
                if(isFirstPlayerNotIdentified){
                    firstPlayerUid = player.data().uid;
                }
            });
            console.info('required update'+ firstPlayerUid);
            return admin.firestore()
                .collection('players')
                .doc(firstPlayerUid)
                .collection('activegames')
                .doc(gameName)
                .update({
                    isActionRequired: true
                }).then(() =>{
                    console.log('updated action');
                    return Promise.resolve();
                });
        });
    }

    private updateAllPlayersToActionRequired(gameName: string): Promise<any>{
        return admin.firestore()
        .collection('games')
        .doc(gameName)
        .collection('players')
        .get()
        .then(players => {
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
