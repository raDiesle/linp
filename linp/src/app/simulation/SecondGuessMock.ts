import {Game, GamePlayerStatus} from '../models/game';

export const SecondGuessMock = function (players, gameName: string) {

  const GAMEPLAYER_STATUS: GamePlayerStatus = 'SECOND_SYNONYM_GIVEN';
  const GAMESTATUS = 'secondguess';

  const request = <Game>{
    name: gameName,
    host: players.playerA.uid,
    status: GAMESTATUS,
    players: [],
    round: 0,
    createdAt: new Date().getTime(),
    language: 'en'
  };
  const requestPlayers = [];

  requestPlayers.push({
    uid: players.playerA.uid,
    name: players.playerA.name,
    isHost: true,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: '?',
    firstSynonym: 'firstSynonym_A',
    secondSynonym: 'secondSynonym_A',
    firstTeamTip: {
      firstPartner: {
        uid: players.playerC.uid,
        name: players.playerC.name
      },
      secondPartner: {
        uid: players.playerB.uid,
        name: players.playerB.name
      }
    },
  });

  requestPlayers.push({
    uid: players.playerB.uid,
    name: players.playerB.name,
    isHost: false,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: 'Word1',
    firstSynonym: 'firstSynonym_B',
    secondSynonym: 'secondSynonym_B',
    firstTeamTip: {
      firstPartner: {
        // ?
        uid: players.playerA.uid,
        name: players.playerA.name
      },
      secondPartner: {
        uid: players.playerF.uid,
        name: players.playerF.name
      }
    },
  });

  requestPlayers.push({
    uid: players.playerC.uid,
    name: players.playerC.name,
    isHost: false,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: 'Word1',
    firstSynonym: 'firstSynonym_C',
    secondSynonym: 'secondSynonym_C',
    firstTeamTip: {
      firstPartner: {
        uid: players.playerC.uid,
        name: players.playerC.name
      },
      secondPartner: {
        uid: players.playerB.uid,
        name: players.playerB.name
      }
    },
  });

  requestPlayers.push({
    uid: players.playerD.uid,
    name: players.playerD.name,
    isHost: false,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: 'Word2',
    firstSynonym: 'firstSynonym_D',
    secondSynonym: 'secondSynonym_D',
    firstTeamTip: {
      firstPartner: {
        uid: players.playerD.uid,
        name: players.playerD.name
      },
      secondPartner: {
        uid: players.playerE.uid,
        name: players.playerE.name
      }
    },
  });

  requestPlayers.push({
    uid: players.playerE.uid,
    name: players.playerE.name,
    isHost: false,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: 'Word2',
    firstSynonym: 'firstSynonym_E',
    secondSynonym: 'secondSynonym_E',
    firstTeamTip: {
      firstPartner: {
        uid: players.playerC.uid,
        name: players.playerC.name
      },
      secondPartner: {
        uid: players.playerB.uid,
        name: players.playerB.name
      }
    },
  });

  requestPlayers.push({
    uid: players.playerF.uid,
    name: players.playerF.name,
    isHost: false,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: '?',
    firstSynonym: 'firstSynonym_F',
    secondSynonym: 'secondSynonym_F',
    firstTeamTip: {
      firstPartner: {
        uid: players.playerC.uid,
        name: players.playerC.name
      },
      secondPartner: {
        uid: players.playerB.uid,
        name: players.playerB.name
      }
    },
  });

  return {
    request: request,
    requestPlayers: requestPlayers
  };
};
