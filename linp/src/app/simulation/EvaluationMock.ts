import {Game} from '../models/game';

export const EvaluationMock = function (players, gameName: string) {
  const PLAYER_STATUS = 'SECOND_GUESS_GIVEN';
  // except one player
  const MISSING_PLAYER_STATUS = 'SECOND_SYNONYM_GIVEN';
  const GAME_STATUS = 'secondguess';

  const request = <Game>{
    name: gameName,
    host: players.playerA.uid,
    status: GAME_STATUS,
    players: [],
    round: 0,
    createdAt : new Date().getTime(),
    language: 'en'
  };
  const requestPlayers = [];
  requestPlayers.push({
    uid: players.playerA.uid,
    name: players.playerA.name,
    isHost: true,
    status: MISSING_PLAYER_STATUS,
    questionmarkOrWord: '?',
    firstSynonym: 'FirstSynA',
    // correct
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
    secondSynonym: 'SecondSynA',
    // correct

    /*
    secondTeamTip: {
      firstPartner: {
        uid: players.playerA.uid,
        name: players.playerA.name
      },
      secondPartner: {
        uid: players.playerE.uid,
        name: players.playerE.name
      }
    },
    */
    pointsScored: {
      firstTeamTip: 0,
      secondTeamTip: 0,
      total: 0,
      totalRounds: 0,
      indirect: 0
    }
  });

  requestPlayers.push({
    uid: players.playerB.uid,
    name: players.playerB.name,
    isHost: false,
    status: PLAYER_STATUS,
    questionmarkOrWord: 'Wort1',
    firstSynonym: 'FirstSynB',
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
    secondSynonym: 'SecondSynB',
    // correct
    secondTeamTip: {
      firstPartner: {
        uid: players.playerD.uid,
        name: players.playerD.name
      },
      secondPartner: {
        uid: players.playerE.uid,
        name: players.playerE.name
      }
    },
    pointsScored: {
      firstTeamTip: 0,
      secondTeamTip: 0,
      total: 0,
      totalRounds: 0,
      indirect: 0
    }
  });

  requestPlayers.push({
    uid: players.playerC.uid,
    name: players.playerC.name,
    isHost: false,
    status: PLAYER_STATUS,
    questionmarkOrWord: 'Wort1',
    firstSynonym: 'FirstSynC',
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
    secondSynonym: 'SecondSynC',
    // correct
    secondTeamTip: {
      firstPartner: {
        uid: players.playerA.uid,
        name: players.playerA.name
      },
      secondPartner: {
        uid: players.playerE.uid,
        name: players.playerE.name
      }
    },
    pointsScored: {
      firstTeamTip: 0,
      secondTeamTip: 0,
      total: 0,
      totalRounds: 0,
      indirect: 0
    }
  });

  requestPlayers.push({
    uid: players.playerD.uid,
    name: players.playerD.name,
    isHost: false,
    status: PLAYER_STATUS,
    questionmarkOrWord: 'Wort2',
    firstSynonym: 'FirstSynD',
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
    secondSynonym: 'SecondSynD',
    // correct
    secondTeamTip: {
      firstPartner: {
        uid: players.playerA.uid,
        name: players.playerA.name
      },
      secondPartner: {
        uid: players.playerB.uid,
        name: players.playerB.name
      }
    },
    pointsScored: {
      firstTeamTip: 0,
      secondTeamTip: 0,
      total: 0,
      totalRounds: 0,
      indirect: 0
    }
  });

  requestPlayers.push({
    uid: players.playerE.uid,
    name: players.playerE.name,
    isHost: false,
    status: PLAYER_STATUS,
    questionmarkOrWord: 'Wort2',
    firstSynonym: 'FirstSynE',
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
    secondSynonym: 'SecondSynE',
    // correct
    secondTeamTip: {
      firstPartner: {
        uid: players.playerD.uid,
        name: players.playerD.name
      },
      secondPartner: {
        uid: players.playerE.uid,
        name: players.playerE.name
      }
    },
    pointsScored: {
      firstTeamTip: 0,
      secondTeamTip: 0,
      total: 0,
      totalRounds: 0,
      indirect: 0
    }
  });

  requestPlayers.push({
    uid: players.playerF.uid,
    name: players.playerF.name,
    isHost: false,
    status: PLAYER_STATUS,
    questionmarkOrWord: '?',
    firstSynonym: 'FirstSynF',
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
    secondSynonym: 'SecondSynF',
    // correct
    secondTeamTip: {
      firstPartner: {
        uid: players.playerA.uid,
        name: players.playerA.name
      },
      secondPartner: {
        uid: players.playerB.uid,
        name: players.playerB.name
      }
    },
    pointsScored: {
      firstTeamTip: 0,
      secondTeamTip: 0,
      total: 0,
      totalRounds: 0,
      indirect: 0
    }
  });

  return {
    request : request,
    requestPlayers: requestPlayers
  };
}
