import {CalculatescoreService} from './calculatescore.service';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';
import {GamePlayer, PointsScored, TeamTip} from '../../../linp/src/app/models/game';

const cors = require('cors')({origin: true});

export class Evaluate {

    private calculatescoreService = new CalculatescoreService();
    cors: any;

    constructor() {
    }

    register() {
        return functions.https.onRequest((request, response) => {
            cors(request, response, () => {
                    this.performAllEvaluateStatusAction(request, response);
                return response.status(200)
                    .send('"{status : "SUCCESS"}"');
            });
        });
    }

    private performAllEvaluateStatusAction(request: any, response: any) {
        admin.firestore()
            .collection('games')
            .doc(request.query.gameName)
            .collection('players')
            .get()
            .then((gamePlayersResult) => {
                const gamePlayers: GamePlayer[] = gamePlayersResult.docs.map(gamePlayer => {
                    return gamePlayer.data();
                });
                const gamePlayerKeys = gamePlayers.map(gamePlayer => {
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

                const gameUpdateRequest: any = this.getScoresDbStructureRequest(request.query.gameName, gamePlayerKeys, gamePlayersObject);
                gamePlayerKeys.forEach((key: string) => {
                    const gameRef = admin.firestore()
                        .collection('games')
                        .doc(request.query.gameName)
                        .collection('players')
                        .doc(key)
                        .update({
                            pointsScored: gameUpdateRequest.pointsScored[key]
                        });
                });

                // JSON.stringify(gamePlayers)
                // afterwards write calculated data to db
            });
    }

    resetPoints(gamePlayerKeys: string[], gamePlayers: { [uid: string]: GamePlayer }) {
        for (const gamePlayerKey of gamePlayerKeys) {
            const gamePlayer = gamePlayers[gamePlayerKey];

            // to be moved
            const initialPointsScored = <PointsScored>{
                firstTeamTip: 0,
                secondTeamTip: 0,
                indirect: 0,
                total: 0,
                totalRounds: gamePlayer.pointsScored.totalRounds
            };
            gamePlayer.pointsScored = initialPointsScored;
        }
    }

    evaluate(gamePlayerKeys: string[], gamePlayers: { [uid: string]: GamePlayer }): void {
        // Rewrite to not manipulate outer objects
        for (const gamePlayerKey of gamePlayerKeys) {
            const gamePlayer = gamePlayers[gamePlayerKey];

            const scoreOfFirstGuess = this.calculateScoresOfGuess(gamePlayers, gamePlayer, gamePlayer.firstTeamTip);
            gamePlayer.pointsScored.firstTeamTip = scoreOfFirstGuess;

            const scoreOfSecondGuess = this.calculateScoresOfGuess(gamePlayers, gamePlayer, gamePlayer.secondTeamTip);
            gamePlayer.pointsScored.secondTeamTip = scoreOfSecondGuess;

            gamePlayer.pointsScored.total += scoreOfFirstGuess + scoreOfSecondGuess;
        }

        for (const gamePlayerKey of gamePlayerKeys) {
            const gamePlayer = gamePlayers[gamePlayerKey];
            gamePlayer.pointsScored.totalRounds += gamePlayer.pointsScored.total;
        }

    }

    calculateScoresOfGuess(gamePlayers: { [uid: string]: GamePlayer }, currentGamePlayer: GamePlayer, teamTip: TeamTip): number {
        const firstTeamPlayer = gamePlayers[teamTip.firstPartner.uid];
        const secondTeamPlayer = gamePlayers[teamTip.secondPartner.uid];
        return this.calculatescoreService.calculateScoreForOneGuess(currentGamePlayer, firstTeamPlayer, secondTeamPlayer);
    }

    private getScoresDbStructureRequest(gameName: string, gamePlayerKeys: string[], gamePlayers: { [p: string]: GamePlayer }) {
        const request = {
            pointsScored: {} as any
        };

        for (const gamePlayerKey of gamePlayerKeys) {
            request.pointsScored[gamePlayerKey] = {};

            request.pointsScored[gamePlayerKey]['firstTeamTip'] = gamePlayers[gamePlayerKey].pointsScored.firstTeamTip;
            request.pointsScored[gamePlayerKey]['secondTeamTip'] = gamePlayers[gamePlayerKey].pointsScored.secondTeamTip;
            request.pointsScored[gamePlayerKey]['indirect'] = gamePlayers[gamePlayerKey].pointsScored.indirect;
            request.pointsScored[gamePlayerKey]['total'] = gamePlayers[gamePlayerKey].pointsScored.total;
            request.pointsScored[gamePlayerKey]['totalRounds'] = gamePlayers[gamePlayerKey].pointsScored.totalRounds;

        }
        return request;
    }
}
