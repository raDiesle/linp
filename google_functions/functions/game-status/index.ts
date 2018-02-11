import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import {Game, GamePlayer, GamePlayerStatus, GameStatus} from '../../../linp/src/app/models/game';
import {Evaluate} from '../evaluate';
import {Preparegame} from "../word-role-assignment/preparegame";

export class GameStatusTrigger {

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
                    'evaluation': (game: Game, name: string) => new Evaluate().performAllEvaluateStatusAction(game, name),
                    'preparegame': (game: Game, name: string) => new Preparegame().perform(game, name)
                };

                const rulesToApplyNewGameStatus = gameStatus === 'evaluation';
                if (rulesToApplyNewGameStatus === false) {
                    return Promise.resolve();
                }

                // TODO return correct promise. might cancel execution !
                return rulesMapping[gameStatus](newValue, gameName);
            });
    }
}
