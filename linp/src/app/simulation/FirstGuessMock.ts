import {Game, GamePlayerStatus} from "../models/game";

export const FirstGuessMock = function (players, gameName: string) {

  const FIRST_SYNONYM_GIVEN_PLAYER_STATUS: GamePlayerStatus = 'FIRST_SYNONYM_GIVEN';

  const request = <Game>{
    name: gameName,
    host: players.playerA.uid,
    status: 'firstguess',
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
    status: FIRST_SYNONYM_GIVEN_PLAYER_STATUS,
    questionmarkOrWord: '?',
    firstSynonym: 'firstSynonym_A'
  });

  requestPlayers.push({
    uid: players.playerB.uid,
    name: players.playerB.name,
    isHost: false,
    status: FIRST_SYNONYM_GIVEN_PLAYER_STATUS,
    questionmarkOrWord: 'Word1',
    firstSynonym: 'firstSynonym_B'
  });

  requestPlayers.push({
    uid: players.playerC.uid,
    name: players.playerC.name,
    isHost: false,
    status: FIRST_SYNONYM_GIVEN_PLAYER_STATUS,
    questionmarkOrWord: 'Word1',
    firstSynonym: 'firstSynonym_C'
  });

  requestPlayers.push({
    uid: players.playerD.uid,
    name: players.playerD.name,
    isHost: false,
    status: FIRST_SYNONYM_GIVEN_PLAYER_STATUS,
    questionmarkOrWord: 'Word2',
    firstSynonym: 'firstSynonym_D'
  });

  requestPlayers.push({
    uid: players.playerE.uid,
    name: players.playerE.name,
    isHost: false,
    status: FIRST_SYNONYM_GIVEN_PLAYER_STATUS,
    questionmarkOrWord: 'Word2',
    firstSynonym: 'firstSynonym_E'
  });

  requestPlayers.push({
    uid: players.playerF.uid,
    name: players.playerF.name,
    isHost: false,
    status: FIRST_SYNONYM_GIVEN_PLAYER_STATUS,
    questionmarkOrWord: '?',
    firstSynonym: 'firstSynonym_F'
  });

  return {
    request: request,
    requestPlayers: requestPlayers
  };
}
