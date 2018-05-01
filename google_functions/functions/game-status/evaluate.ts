import {CalculatescoreService} from './calculatescore.service';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import {
    Game, GamePlayer, GameTotalPoints, PointsScored, TeamTip
} from '../../../linp/src/app/models/game';
import {WriteResult} from '@google-cloud/firestore';

export class Evaluate {

    private calculatescoreService = new CalculatescoreService();


    constructor() {
    }


    public performAllEvaluateStatusAction(game: Game, gameName: string): Promise<[WriteResult[], WriteResult]> {
        

        const promise = admin.firestore()
            .collection('games')
            .doc(gameName)
            .collection('players')
            .get()
            .then((gamePlayersResult) => {
               
                const gamePlayers: GamePlayer[] = gamePlayersResult.docs.map(gamePlayer => {
                    return gamePlayer.data();
                });
                const gamePlayerKeys: string[] = gamePlayers.map(gamePlayer => {
                    return gamePlayer.uid;
                });

                const arrayToObject = (array: any) =>
                    array.reduce((obj: any, item: any) => {
                        obj[item.uid] = item;
                        return obj;
                    }, {});

                const gamePlayersObject: { [uid: string]: GamePlayer } = arrayToObject(gamePlayers);

                // move to other page
                this.resetPoints(gamePlayerKeys, gamePlayersObject);
                this.evaluate(gamePlayerKeys, gamePlayersObject);

                // obsolete for players
                this.addTotalPoints(gamePlayerKeys, gamePlayersObject);
                // obsolete for players
                this.addRanking(gamePlayerKeys, gamePlayersObject, gamePlayers);

                const gameUpdateRequest: any = this.getScoresDbStructureRequest(gameName, gamePlayerKeys, gamePlayersObject);

                const gamePlayersPromise = this.updateGamePlayers(gamePlayerKeys, gameName, gameUpdateRequest);
                const gamePromise = this.updateGame(gamePlayerKeys, gamePlayersObject, game.round, gameName);

                return Promise.all([gamePlayersPromise, gamePromise]);
            });

        return promise;
    }

    private addTotalPoints(gamePlayerKeys: string[], gamePlayersObject: { [p: string]: GamePlayer }) {
        for (const gamePlayerKey of gamePlayerKeys) {
            const gamePlayer = gamePlayersObject[gamePlayerKey];
            gamePlayer.pointsScored.totalRounds += gamePlayer.pointsScored.total;
        }
    }

    private updateGamePlayers(gamePlayerKeys: string[], gameName: string, gameUpdateRequest: any) {
        const batch = admin.firestore().batch();
        gamePlayerKeys.forEach((key: string) => {
            const gameRef = admin.firestore()
                .collection('games')
                .doc(gameName)
                .collection('players')
                .doc(key);

            batch.update(gameRef, {
                pointsScored: gameUpdateRequest.pointsScored[key],
                totalRanking: gameUpdateRequest[key].totalRanking
            });
        });
        const gamePlayersPromise = batch.commit();
        return gamePlayersPromise;
    }

    resetPoints(gamePlayerKeys: string[], gamePlayers: { [uid: string]: GamePlayer }) {
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
        }
    }

    evaluate(gamePlayerKeys: string[], gamePlayers: { [uid: string]: GamePlayer }): void {
        // Rewrite to not manipulate outer objects
        for (const gamePlayerKey of gamePlayerKeys
            ) {
            const gamePlayer = gamePlayers[gamePlayerKey];

            const scoreOfFirstGuess = this.calculateScoresOfGuess(gamePlayers, gamePlayer, gamePlayer.firstTeamTip);
            gamePlayer.pointsScored.firstTeamTip = scoreOfFirstGuess;

            const scoreOfSecondGuess = this.calculateScoresOfGuess(gamePlayers, gamePlayer, gamePlayer.secondTeamTip);
            gamePlayer.pointsScored.secondTeamTip = scoreOfSecondGuess;

            gamePlayer.pointsScored.total += scoreOfFirstGuess + scoreOfSecondGuess;
        }
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
            request[gamePlayerKey]['totalRanking'] = gamePlayers[gamePlayerKey].totalRanking;
        }
        return request;
    }

    private addRanking(gamePlayerKeys: string[],
                       gamePlayersObject: { [p: string]: GamePlayer },
                       gamePlayers: GamePlayer[]) {
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
    }

    private updateGame(gamePlayerKeys: string[],
                       gamePlayers: { [p: string]: GamePlayer },
                       round: number,
                       gameName: string): Promise<WriteResult> {
        // TODO type
        const pointsScoredTotal: { [p: string]: GameTotalPoints } = {};
        gamePlayerKeys.forEach(gamePlayerKey => {
            pointsScoredTotal[gamePlayerKey] = {
                uid: gamePlayers[gamePlayerKey].uid,
                name: gamePlayers[gamePlayerKey].name,
                points: gamePlayers[gamePlayerKey].pointsScored.totalRounds,
                ranking: gamePlayers[gamePlayerKey].totalRanking
            };
        });

        const gameRequest: Game | any = {
            pointsScoredTotal: pointsScoredTotal,
            round: round + 1
        };
        return admin.firestore()
            .collection('games')
            .doc(gameName)
            .update(gameRequest)
    }
}
