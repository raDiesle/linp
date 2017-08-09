import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {Game} from '../models/game';
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

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit {

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFireDatabase) {
  }

  ngOnInit() {
  }

  createForEvaluation() {

    const gamename = 'test-evaluation';

    const request = <Game>{
      name: gamename,
      host: players.playerA.uid,
      players: {
      }
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
         uid : players.playerC.uid,
         name : players.playerC.name
        },
        secondPartner: {
          uid : players.playerB.uid,
          name :  players.playerB.name
        }
      },
      secondSynonym: 'SecondSynA',
      // correct
      secondTeamTip: {
        firstPartner: {
          uid : players.playerD.uid,
          name : players.playerD.name
        },
        secondPartner: {
          uid : players.playerE.uid,
          name : players.playerE.name
        }
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
          uid : players.playerA.uid,
          name : players.playerA.name
        },
        secondPartner: {
          uid : players.playerC.uid,
          name :  players.playerC.name
        }
      },
      secondSynonym: 'SecondSynB',
      // correct
      secondTeamTip: {
        firstPartner: {
          uid : players.playerD.uid,
          name : players.playerD.name
        },
        secondPartner: {
          uid : players.playerE.uid,
          name : players.playerE.name
        }
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
          uid : players.playerC.uid,
          name : players.playerC.name
        },
        secondPartner: {
          uid : players.playerB.uid,
          name :  players.playerB.name
        }
      },
      secondSynonym: 'SecondSynC',
      // correct
      secondTeamTip: {
        firstPartner: {
          uid : players.playerD.uid,
          name : players.playerD.name
        },
        secondPartner: {
          uid : players.playerE.uid,
          name : players.playerE.name
        }
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
          uid : players.playerD.uid,
          name : players.playerD.name
        },
        secondPartner: {
          uid : players.playerE.uid,
          name :  players.playerE.name
        }
      },
      secondSynonym: 'SecondSynD',
      // correct
      secondTeamTip: {
        firstPartner: {
          uid : players.playerA.uid,
          name : players.playerA.name
        },
        secondPartner: {
          uid : players.playerB.uid,
          name : players.playerB.name
        }
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
          uid : players.playerC.uid,
          name : players.playerC.name
        },
        secondPartner: {
          uid : players.playerB.uid,
          name :  players.playerB.name
        }
      },
      secondSynonym: 'SecondSynE',
      // correct
      secondTeamTip: {
        firstPartner: {
          uid : players.playerD.uid,
          name : players.playerD.name
        },
        secondPartner: {
          uid : players.playerE.uid,
          name : players.playerE.name
        }
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
          uid : players.playerC.uid,
          name : players.playerC.name
        },
        secondPartner: {
          uid : players.playerB.uid,
          name :  players.playerB.name
        }
      },
      secondSynonym: 'SecondSynF',
      // correct
      secondTeamTip: {
        firstPartner: {
          uid : players.playerA.uid,
          name : players.playerA.name
        },
        secondPartner: {
          uid : players.playerB.uid,
          name : players.playerB.name
        }
      }
    };

    this.db.database.ref('games/' + gamename)
      .set(request);
  }
}
