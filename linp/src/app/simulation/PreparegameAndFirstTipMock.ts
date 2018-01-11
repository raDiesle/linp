import {Game} from '../models/game';

export const PreparegameMock = function (players, gameName: string) {
  const request = <Game>{
    name: gameName,
    host: players.playerA.uid,
    status: 'preparegame',
    players: [],
    round: 0,
    createdAt: new Date().getTime(),
    language: 'en'
  };
  const requestPlayers = [];

  const GAMEPLAYER_STATUS = 'JOINED_GAME';
  requestPlayers.push({
    uid: players.playerA.uid,
    name: players.playerA.name,
    isHost: true,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: '?'
  });

  requestPlayers.push({
    uid: players.playerB.uid,
    name: players.playerB.name,
    isHost: false,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: 'Word1'
  });

  requestPlayers.push({
    uid: players.playerC.uid,
    name: players.playerC.name,
    isHost: false,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: 'Word1'
  });

  requestPlayers.push({
    uid: players.playerD.uid,
    name: players.playerD.name,
    isHost: false,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: 'Word2'
  });

  requestPlayers.push({
    uid: players.playerE.uid,
    name: players.playerE.name,
    isHost: false,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: 'Word2'
  });

  requestPlayers.push({
    uid: players.playerF.uid,
    name: players.playerF.name,
    isHost: false,
    status: GAMEPLAYER_STATUS,
    questionmarkOrWord: '?'
  });

  return {
    request : request,
    requestPlayers: requestPlayers
  };
}
