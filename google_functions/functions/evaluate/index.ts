import {GamePlayer, PointsScored, TeamTip} from '../../../../linp/src/app/models/game';
import {CalculatescoreService} from './calculatescore.service';
import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin';

export class Evaluate {

    private calculatescoreService = new CalculatescoreService();

    constructor() {
    }

    register() {
        return functions.https.onRequest((request, response) => {
            if (request.query.status === 'EVALUATE') {
                admin.database().ref('/games/' + request.query.gameName + '/players')
                    .once('value')
                    .then((gamePlayersSnapshot: any) => {
                        const gamePlayers: { [uid: string]: GamePlayer } = gamePlayersSnapshot.val();
                        const gamePlayerKeys = Object.keys(gamePlayers);

                        this.resetPoints(gamePlayerKeys, gamePlayers);
                        this.evaluate(gamePlayerKeys, gamePlayers);

                        console.log(gamePlayers);
                        this.writeAllScoresToDB(request.query.gameName, gamePlayerKeys, gamePlayers);
                        response.status(200)
                            .send('SUCCESS'); //JSON.stringify(gamePlayers)
                        // afterwards write calculated data to db
                    });
            }
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

            gamePlayer.pointsScored.totalRounds += gamePlayer.pointsScored.total;
        }
    }

    calculateScoresOfGuess(gamePlayers: { [uid: string]: GamePlayer }, currentGamePlayer: GamePlayer, teamTip: TeamTip): number {
        const firstTeamPlayer = gamePlayers[teamTip.firstPartner.uid];
        const secondTeamPlayer = gamePlayers[teamTip.secondPartner.uid];
        return this.calculatescoreService.calculateScoreForOneGuess(currentGamePlayer, firstTeamPlayer, secondTeamPlayer);
    }

    private writeAllScoresToDB(gameName: string, gamePlayerKeys: string[], gamePlayers: { [p: string]: GamePlayer}) {
        for (const gamePlayerKey of gamePlayerKeys) {
            admin.database()
                .ref('/games/' + gameName + '/players/' + gamePlayerKey + '/pointsScored/')
                .update(gamePlayers[gamePlayerKey].pointsScored);
        }
    }
}
