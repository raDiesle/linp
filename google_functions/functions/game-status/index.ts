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
                const gameName = (event.params as any).gameName as string;

                const newValue = event.data.data() as Game;
                const previousValue = event.data.previous.data() as Game;
                const gameStatus = newValue.status;
                if (gameStatus === previousValue.status) {
                    return Promise.resolve();
                }

                const rulesMapping: { [gameStatus: string]: any } = {
                    'evaluation': (game: Game, name: string) => this.evaluate.performAllEvaluateStatusAction(game, name),
                    'preparegame': (game: Game, name: string) => this.preparegame.perform(game, name)
                };

                const isARuleToBeApplied = Object.keys(rulesMapping).some(key => key === gameStatus);
                
                if (isARuleToBeApplied === false) {
                    return Promise.resolve();
                }

                // TODO return correct promise. might cancel execution !
                return rulesMapping[gameStatus](newValue, gameName);
            });
    }
}
