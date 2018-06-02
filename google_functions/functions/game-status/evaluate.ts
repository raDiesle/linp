import { CalculatescoreService } from './calculatescore.service';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import {
    Game, GamePlayer, GameTotalPoints, PointsScored, TeamTip
} from '../../../linp/src/app/models/game';
import { WriteResult } from '@google-cloud/firestore';

export class Evaluate {

    private calculatescoreService = new CalculatescoreService();

    constructor() {
    }

    private arrayToObject(array: any) {
        return array.reduce((obj: any, item: any) => {
            obj[item.uid] = item;
            return obj;
        }, {});
    }

    public performAllEvaluateStatusAction(game: Game, gameName: string): Promise<any> {
        return admin.firestore()
            .collection('games')
            .doc(gameName)
            .collection('players')
            .get()
            .then((gamePlayersResult) => {

                const gamePlayers: GamePlayer[] = gamePlayersResult.docs.map(gamePlayer => gamePlayer.data());
                const gamePlayerKeys: string[] = gamePlayers.map(gamePlayer => gamePlayer.uid);
                const gamePlayersObjectOriginal: { [uid: string]: GamePlayer } = this.arrayToObject(gamePlayers);

                // move to other page
                const gamePlayersObjectResettedPoints = this.resetPoints(gamePlayerKeys, gamePlayersObjectOriginal);
                let gamePlayersObject = this.evaluateScores(gamePlayerKeys, gamePlayersObjectResettedPoints);

                // obsolete for players
                gamePlayersObject = this.addTotalPoints(gamePlayerKeys, gamePlayersObject);
                // obsolete for players
                gamePlayersObject = this.addRanking(gamePlayerKeys, gamePlayersObject, gamePlayers);
                // TODO make it obsolete
                const gameUpdateRequest: any = this.getScoresDbStructureRequest(gameName, gamePlayerKeys, gamePlayersObject);


                const gamePlayersPromise = this.updateGamePlayers(gamePlayerKeys, gameName, gameUpdateRequest);
                const gamePromise = this.updateGame(gamePlayerKeys, gamePlayersObject, game.round, gameName, gameUpdateRequest);

                console.info("will perform");
                return Promise.all([gamePlayersPromise, gamePromise]);
            });
    }

    private addTotalPoints(gamePlayerKeys: string[], gamePlayersInput: { [p: string]: GamePlayer }): { [p: string]: GamePlayer } {
        const gamePlayersObject = Object.assign({}, gamePlayersInput);
        for (const gamePlayerKey of gamePlayerKeys) {
            const gamePlayer = gamePlayersObject[gamePlayerKey];
            gamePlayer.pointsScored.totalRounds += gamePlayer.pointsScored.total;
        }
        return gamePlayersObject;
    }

    private updateGamePlayers(gamePlayerKeys: string[], gameName: string, gameUpdateRequest: any): Promise<any> {
        const batch = admin.firestore().batch();
        gamePlayerKeys.forEach((key: string) => {
            const gameRef = admin.firestore()
                .collection('games')
                .doc(gameName)
                .collection('players')
                .doc(key);

            batch.update(gameRef, {
                pointsScored: gameUpdateRequest.pointsScored[key],
                // obsolete
                totalRanking: gameUpdateRequest[key].totalRanking                
            });
        });

        return batch.commit();
    }

    private updateGame(gamePlayerKeys: string[],
        gamePlayers: { [p: string]: GamePlayer },
        round: number,
        gameName: string,
        gameUpdateRequest: any): Promise<WriteResult> {
        // TODO type
        const pointsScoredTotal: { [p: string]: GameTotalPoints } = {};
        const evaluationSummary: any = [];
        gamePlayerKeys.forEach(gamePlayerKey => {
            const gamePlayer = gamePlayers[gamePlayerKey];
            gamePlayer.pointsScored = gameUpdateRequest.pointsScored[gamePlayerKey];
            //gamePlayer.fakedOrUncovered = gameUpdateRequest[gamePlayerKey].fakedOrUncovered;
            evaluationSummary.push(gamePlayer);

            pointsScoredTotal[gamePlayerKey] = {
                uid: gamePlayers[gamePlayerKey].uid,
                name: gamePlayers[gamePlayerKey].name,
                points: gamePlayers[gamePlayerKey].pointsScored.totalRounds,
                ranking: gamePlayers[gamePlayerKey].totalRanking
            };
        });

        const gameRequest: Game | any = {
            evaluationSummary: evaluationSummary,
            pointsScoredTotal: pointsScoredTotal,
            round: round + 1
        };
        return admin.firestore()
            .collection('games')
            .doc(gameName)
            .update(gameRequest)
    }

    resetPoints(gamePlayerKeys: string[], gamePlayersInput: { [uid: string]: GamePlayer }): { [uid: string]: GamePlayer } {
        const gamePlayers = Object.assign({}, gamePlayersInput);
        for (const gamePlayerKey of gamePlayerKeys) {
            const gamePlayer = gamePlayers[gamePlayerKey];

            const totalPoints = gamePlayer.pointsScored === undefined ? 0 : gamePlayer.pointsScored.totalRounds;
            // to be moved
            const initialPointsScored = <PointsScored>{
                firstTeamTip: 0,
                secondTeamTip: 0,
                indirect: 0,
                total: 0,
                totalRounds: totalPoints
            };
            gamePlayer.pointsScored = initialPointsScored;
            gamePlayer.fakedOrUncovered = [];
        }
        return gamePlayers;
    }

    evaluateScores(gamePlayerKeys: string[], gamePlayersObjectResettedPoints: { [uid: string]: GamePlayer }): { [uid: string]: GamePlayer } {
        const gamePlayers = Object.assign({}, gamePlayersObjectResettedPoints);
        // Rewrite to not manipulate outer objects
        for (const gamePlayerKey of gamePlayerKeys) {
            const gamePlayer = gamePlayers[gamePlayerKey];


            const scoreOfFirstGuess = this.calculateScoresOfGuess(gamePlayers, gamePlayer, gamePlayer.firstTeamTip);
            gamePlayer.pointsScored.firstTeamTip = scoreOfFirstGuess;

            const scoreOfSecondGuess = this.calculateScoresOfGuess(gamePlayers, gamePlayer, gamePlayer.secondTeamTip);
            gamePlayer.pointsScored.secondTeamTip = scoreOfSecondGuess;

            gamePlayer.pointsScored.total += scoreOfFirstGuess + scoreOfSecondGuess;
        }
        return gamePlayers;
    }

    calculateScoresOfGuess(gamePlayers: { [uid: string]: GamePlayer },
        currentGamePlayer: GamePlayer,
        teamTip: TeamTip): number {
        const firstTeamPlayer = gamePlayers[teamTip.firstPartner.uid];
        const secondTeamPlayer = gamePlayers[teamTip.secondPartner.uid];
        return this.calculatescoreService.calculateScoreForOneGuess(currentGamePlayer, firstTeamPlayer, secondTeamPlayer);
    }

    private getScoresDbStructureRequest(gameName: string,
        gamePlayerKeys: string[],
        gamePlayers: { [p: string]: GamePlayer }) {
        const request: any = {
            pointsScored: {} as any,
            totalRanking: 0 as number
        };

        for (const gamePlayerKey of gamePlayerKeys) {
            request.pointsScored[gamePlayerKey] = {};

            request.pointsScored[gamePlayerKey]['firstTeamTip'] = gamePlayers[gamePlayerKey].pointsScored.firstTeamTip;
            request.pointsScored[gamePlayerKey]['secondTeamTip'] = gamePlayers[gamePlayerKey].pointsScored.secondTeamTip;
            request.pointsScored[gamePlayerKey]['indirect'] = gamePlayers[gamePlayerKey].pointsScored.indirect;
            request.pointsScored[gamePlayerKey]['total'] = gamePlayers[gamePlayerKey].pointsScored.total;
            request.pointsScored[gamePlayerKey]['totalRounds'] = gamePlayers[gamePlayerKey].pointsScored.totalRounds;
            
            request[gamePlayerKey] = {};
            request[gamePlayerKey]['fakedOrUncovered'] = gamePlayers[gamePlayerKey].fakedOrUncovered;
            request[gamePlayerKey]['totalRanking'] = gamePlayers[gamePlayerKey].totalRanking;
        }
        return request;
    }

    private addRanking(gamePlayerKeys: string[],
        gamePlayersInput: { [p: string]: GamePlayer },
        gamePlayers: GamePlayer[]): { [p: string]: GamePlayer } {

        const gamePlayersObject = Object.assign({}, gamePlayersInput);
        gamePlayers.sort((a, b) => {
            if (a.pointsScored.total > b.pointsScored.total) {
                return -1;
            }
            if (a.pointsScored.total < b.pointsScored.total) {
                return 1;
            }
            return 0;
        });

        gamePlayers.forEach((value, index) => {
            gamePlayersObject[value.uid].totalRanking = index + 1;
        });
        return gamePlayersObject;
    }
}

