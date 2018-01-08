import {Game} from "../models/game";

export const PreparegameMock = function (players) {
  const request = <Game>{
    name: this.gameName,
    host: players.playerA.uid,
    status: 'preparegame',
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
    status: 'JOINED_GAME',
    questionmarkOrWord: '?'
  });

  requestPlayers.push({
    uid: players.playerB.uid,
    name: players.playerB.name,
    isHost: false,
    status: 'JOINED_GAME',
    questionmarkOrWord: 'Word1'
  });

  requestPlayers.push({
    uid: players.playerC.uid,
    name: players.playerC.name,
    isHost: false,
    status: 'JOINED_GAME',
    questionmarkOrWord: 'Word1'
  });

  requestPlayers.push({
    uid: players.playerD.uid,
    name: players.playerD.name,
    isHost: false,
    status: 'JOINED_GAME',
    questionmarkOrWord: 'Word2'
  });

  requestPlayers.push({
    uid: players.playerE.uid,
    name: players.playerE.name,
    isHost: false,
    status: 'JOINED_GAME',
    questionmarkOrWord: 'Word2'
  });

  requestPlayers.push({
    uid: players.playerF.uid,
    name: players.playerF.name,
    isHost: false,
    status: 'JOINED_GAME',
    questionmarkOrWord: '?'
  });

  return {
    request : request,
    requestPlayers: requestPlayers
  }
}
