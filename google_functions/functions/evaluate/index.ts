import {GamePlayer, PointsScored, TeamTip} from '../../../../linp/src/app/models/game';
import {CalculatescoreService} from './calculatescore.service';
import * as functions from 'firebase-functions'

export class Evaluate {

    private calculatescoreService = new CalculatescoreService();

    constructor() {
    }

    register() {
        const gameName = 'test-evaluation';
        return functions.database.ref('/games/' + gameName + '/players')
            .onUpdate(async event => {
                const original = event.data.val();
                const pushId = (event.params as any).pushId;
                console.log('Uppercasing', pushId, original);
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
            // use promise chained callback instead
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
}
