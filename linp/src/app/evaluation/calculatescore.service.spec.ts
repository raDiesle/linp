import {TestBed, inject} from '@angular/core/testing';

import {CalculatescoreService} from './calculatescore.service';
import {Game, GamePlayer} from '../models/game';
import {SimulationComponent} from '../simulation/simulation.component';
import {PlayerProfile} from '../models/player';

const players: { [uid: string]: PlayerProfile } = {
  playerA: {
    uid: 'lnvb5qyrYJQ59ndQcNf5mlUXBpi2',
    name: 'playerA'
  },
  playerB: {
    uid: '79dcujI4LCcxClfJeWvse415gAq1',
    name: 'playerB'
  },
  playerC: {
    uid: 'q4PvJOKoPJNjlzqWI8STHpRcil22',
    name: 'playerC'
  },
  playerD: {
    uid: 'DSDzE96HxSamuirC05NLNhN6x0z1',
    name: 'playerD'
  },
  playerE: {
    uid: 'UuS2hKP4BmhaqtLUA58bytDNMrZ2',
    name: 'playerE'
  },
  playerF: {
    uid: 'oVHSNM6pFvhkJ0QVQxetFMSFjJC2',
    name: 'playerF'
  }
};

describe('CalculatescoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CalculatescoreService],
      declarations: [
        // CalculatescoreService
      ]
    });
  });

  it('should be created', inject([CalculatescoreService], (service: CalculatescoreService) => {
    expect(service).toBeTruthy();
  }));

  it('should calculate two questionmarks', inject([CalculatescoreService],
    (service: CalculatescoreService) => {


      const gamename = 'test-evaluation';

      const request = <Game>{
        name: gamename,
        host: players.playerA.uid,
        players: {}
      };
      request.players[players.playerA.uid] = {
        uid: players.playerA.uid,
        name: players.playerA.name,
        status: 'CREATED',
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
          indirect: 0,
          totalRounds: 0,
          total: 0,
        }
      };

      request.players[players.playerB.uid] = {
        uid: players.playerB.uid,
        name: players.playerB.name,
        status: 'JOINED',
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
          indirect: 0,
          total: 0,
          totalRounds: 0,
        }
      };

      request.players[players.playerC.uid] = {
        uid: players.playerC.uid,
        name: players.playerC.name,
        status: 'JOINED',
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
          indirect: 0,
          total: 0,
          totalRounds: 0,
        }
      };

      request.players[players.playerD.uid] = {
        uid: players.playerD.uid,
        name: players.playerD.name,
        status: 'JOINED',
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
          indirect: 0,
          total: 0,
          totalRounds: 0,
        }
      };

      request.players[players.playerE.uid] = {
        uid: players.playerE.uid,
        name: players.playerE.name,
        status: 'JOINED',
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
          indirect: 0,
          total: 0,
          totalRounds: 0,
        }
      };

      request.players[players.playerF.uid] = {
        uid: players.playerF.uid,
        name: players.playerF.name,
        status: 'JOINED',
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
          indirect: 0,
          total: 0,
          totalRounds: 0,
        }
      };

      service.calculateScoreForOneGuess(
        request.players[players.playerA.uid],
        request.players[request.players[players.playerA.uid].firstTeamTip.firstPartner.uid],
        request.players[request.players[players.playerA.uid].firstTeamTip.secondPartner.uid]);

      expect(request.players[players.playerA.uid].pointsScored.total).toBe(2);
    }));

});
