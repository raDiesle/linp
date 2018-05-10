import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { Game, GamePlayer, GameStatus, GamePlayerStatus } from '../../../linp/src/app/models/game';
import { DocumentSnapshot, WriteResult, QuerySnapshot } from '@google-cloud/firestore';

export class PlayerStatusTrigger {

    constructor() {
    }

    public register() {
        return functions.firestore
            .document('games/{gameName}/players/{uid}')
            .onUpdate((change, context) => {
                
                const gameName = (context.params as any).gameName as string;
                const uid = (context.params as any).uid as string;                                

                const newValue = change.after.data() as GamePlayer;
                const playerStatus = newValue.status;
                const previousValue = change.before.data() as GamePlayer;
                if (newValue.status === previousValue.status) {                    
                    return Promise.resolve();
                }
               
                return this.checkPlayersAndHandleActions(playerStatus, uid, gameName);
            });
    }

    private checkPlayersAndHandleActions(
        playerStatus: GamePlayerStatus,        
        uid: string,
        gameName: string
    ): Promise<any> {
        return admin.firestore()
            .collection('games')
            .doc(gameName)
            .collection('players')
            .get()
            .then((players: QuerySnapshot) => {

                // TODO better code                       
                // single player handling in new game state: 1. & 2. Tip

                // To not need call to /game                                                

                // set first simple case: all players turn, and just to set player to finish                
                let nextSinglePlayersTurn: GamePlayer = this.handleIfSinglePlayersTurn(playerStatus, players);
                let playerProfileActionPromise: Promise<any> = Promise.resolve();
                
                if (nextSinglePlayersTurn !== null) {
                    // set next players turn
                    playerProfileActionPromise = admin.firestore()
                        .collection('players')
                        .doc(nextSinglePlayersTurn.uid)
                        .collection('activegames')
                        .doc(gameName)
                        .update({
                            isActionRequired: true
                        });
                }

                // on any action, expect that current player did done action
                // const playerToSetToDone: GamePlayer = this.getCurrentPlayer(uid, players);
                let playerProfileNoActionPromise: Promise<any> = Promise.resolve();
                
                if (nextSinglePlayersTurn === null || nextSinglePlayersTurn.uid !== uid) {
                    // set current player to done
                    
                    playerProfileNoActionPromise = admin.firestore()
                        .collection('players')
                        .doc(uid)
                        .collection('activegames')
                        .doc(gameName)
                        .update({
                            isActionRequired: false
                        });
                }

                let gameStatusPromise: Promise<any> = Promise.resolve();
                if (this.hasAllPlayersSameStatus(players, playerStatus)) {
                    gameStatusPromise = this.writeNewGameStatus(playerStatus, gameName)
                }
                return Promise.all([playerProfileActionPromise, playerProfileNoActionPromise, gameStatusPromise]);
            });
    }

    private handleIfSinglePlayersTurn(playerStatus: string, players: FirebaseFirestore.QuerySnapshot) {
        const SINGLE_PLAYERS_TURN_CASES = {
            FIRST_TIP: {
                // depre
                PREV_PLAYER_STATUS: 'READY_TO_START' as GamePlayerStatus,
                DONE_HIS_TIP_STATUS: 'FIRST_SYNONYM_GIVEN' as GamePlayerStatus
            },
            SECOND_TIP: {
                // depre
                PREV_PLAYER_STATUS: 'FIRST_GUESS_GIVEN' as GamePlayerStatus,
                DONE_HIS_TIP_STATUS: 'SECOND_SYNONYM_GIVEN' as GamePlayerStatus
            }
        };
        let nextSinglePlayersTurn: GamePlayer = null;
                
        if (this.isWithinTipStatus(players, playerStatus, SINGLE_PLAYERS_TURN_CASES.FIRST_TIP.DONE_HIS_TIP_STATUS)) {            
            nextSinglePlayersTurn = this.identifyNextSinglePlayersTurn(playerStatus, SINGLE_PLAYERS_TURN_CASES.FIRST_TIP, players, nextSinglePlayersTurn);
        }
        else if (this.isWithinTipStatus(players, playerStatus, SINGLE_PLAYERS_TURN_CASES.SECOND_TIP.DONE_HIS_TIP_STATUS)) {
            nextSinglePlayersTurn = this.identifyNextSinglePlayersTurn(playerStatus, SINGLE_PLAYERS_TURN_CASES.SECOND_TIP, players, nextSinglePlayersTurn);
        }
        return nextSinglePlayersTurn;
    }

    getCurrentPlayer(uid: string, players: FirebaseFirestore.QuerySnapshot): GamePlayer {
        let hasIdentifiedCurrentPlayer = false;
        let currentPlayer: GamePlayer;
        players.forEach(player => {
            if (hasIdentifiedCurrentPlayer && player.data().uid === uid) {
                currentPlayer = player.data();
                hasIdentifiedCurrentPlayer = true;
            }
        });
        return currentPlayer;
    }

    private identifyNextSinglePlayersTurn(playerStatus: string, STATUS_TO_CHECK: { [id: string]: GamePlayerStatus }, players: FirebaseFirestore.QuerySnapshot, nextPlayersTurn: GamePlayer) {
        if (this.isWithinTipStatus(players, playerStatus, STATUS_TO_CHECK.DONE_HIS_TIP_STATUS)) {
            nextPlayersTurn = this.getFirstPlayerWithDifferentStatus(STATUS_TO_CHECK.DONE_HIS_TIP_STATUS, players);
        }
        return nextPlayersTurn;
    }

    private isWithinTipStatus(players: FirebaseFirestore.QuerySnapshot, playerStatus: string, DONE_HIS_TIP_STATUS: string) {                
        return this.hasAllPlayersSameStatus(players, playerStatus) === false && DONE_HIS_TIP_STATUS === playerStatus;
    }

    private isEnteringTipStatus(playerStatus: string, PREV_PLAYER_STATUS: string, players: FirebaseFirestore.QuerySnapshot) {
        return this.isLastPlayerBeforeTIP_Status(playerStatus, PREV_PLAYER_STATUS, this.hasAllPlayersSameStatus(players, playerStatus));
    }

    private hasAllPlayersSameStatus(players: FirebaseFirestore.QuerySnapshot, playerStatus: string) {
        let countPlayersWithNewStatus = 0;
        players.forEach(player => {
            if (player.data().status === playerStatus) {
                countPlayersWithNewStatus++;
            }
        });
        const isAllPlayersHaveSameState = countPlayersWithNewStatus === players.size;
        return isAllPlayersHaveSameState;
    }

    private isLastPlayerBeforeTIP_Status(playerStatus: string, PREV_PLAYER_STATUS: string, isAllPlayersHaveSameState: boolean) {
        const isStatusBefore_TIP = playerStatus === PREV_PLAYER_STATUS;
        const isLastPlayerInPrevStateToTriggerGameStatus_TIP = isAllPlayersHaveSameState && isStatusBefore_TIP;
        return isLastPlayerInPrevStateToTriggerGameStatus_TIP;
    }

    private getFirstPlayerInList(players: FirebaseFirestore.QuerySnapshot) {
        let nextPlayersTurn: GamePlayer;
        let isFirstPlayer = true;
        players.forEach(player => {
            if (isFirstPlayer) {
                nextPlayersTurn = player.data();
                isFirstPlayer = false;
            }
        });
        return nextPlayersTurn;
    }

    private getFirstPlayerWithDifferentStatus(playersDoneStatus: GamePlayerStatus, players: FirebaseFirestore.QuerySnapshot): GamePlayer {
        // TODO functional code
        let nextPlayersTurn: GamePlayer;
        let isNextPlayerWithNoDoneStatusWasNotIdentified = true;
        players.forEach(player => {
            if (isNextPlayerWithNoDoneStatusWasNotIdentified && player.data().status !== playersDoneStatus) {
                nextPlayersTurn = player.data();
                isNextPlayerWithNoDoneStatusWasNotIdentified = false;
            }
        });
        return nextPlayersTurn;
    }

    private writeNewGameStatus(playerStatus: GamePlayerStatus, gameName: string): Promise<WriteResult> {
        /*
                const isConfiguredRuleToApplyNewGameStatus =
                    Object.keys(newGameStatusMapping).some(status => status === playerStatus)
                if (isConfiguredRuleToApplyNewGameStatus === false) {
                    return Promise.resolve();
                }
*/
        const newGameStatusMapping: { [status: string]: GameStatus } = {
            'READY_TO_START': 'firsttip',
            'FIRST_SYNONYM_GIVEN': 'firstguess',
            'FIRST_GUESS_GIVEN': 'secondtip',
            'SECOND_SYNONYM_GIVEN': 'secondguess',
            'SECOND_GUESS_GIVEN': 'evaluation',
            'CHECKED_EVALUATION': 'finalizeround',
            'READY_FOR_NEXT_GAME': 'firsttip'
        };
        // typing
        const newGameStatus = newGameStatusMapping[playerStatus];
        return admin.firestore()
            .collection('games')
            .doc(gameName)
            .update({
                status: newGameStatus
            });
    }
}
