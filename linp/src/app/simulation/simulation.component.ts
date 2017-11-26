import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Game} from '../models/game';
import {PlayerProfile} from '../models/player';
import {Subject} from 'rxjs/Subject';
import {LinpCardsModelService} from './linpcardsinit.service';
import {Observable} from 'rxjs/Observable';

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

const gamename = 'test-evaluation';

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private queryResults: Observable<{}[]>;

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFirestore,
              public linpCardsModelService: LinpCardsModelService) {
  }

  ngOnInit() {
  }

  createForEvaluation() {
    const request = <Game>{
      name: gamename,
      host: players.playerA.uid,
      status: 'SECOND_GUESS_GIVEN',
      players: [],
      round: 0
    };
    request.players.push({
      uid: players.playerA.uid,
      name: players.playerA.name,
      status: 'SECOND_GUESS_GIVEN',
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
        total: 0,
        totalRounds: 0,
        indirect: 0
      }
    });

    request.players.push({
      uid: players.playerB.uid,
      name: players.playerB.name,
      status: 'SECOND_GUESS_GIVEN',
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

    request.players.push({
      uid: players.playerC.uid,
      name: players.playerC.name,
      status: 'SECOND_GUESS_GIVEN',
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

    request.players.push({
      uid: players.playerD.uid,
      name: players.playerD.name,
      status: 'SECOND_GUESS_GIVEN',
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

    request.players.push({
      uid: players.playerE.uid,
      name: players.playerE.name,
      status: 'SECOND_GUESS_GIVEN',
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

    request.players.push({
      uid: players.playerF.uid,
      name: players.playerF.name,
      status: 'SECOND_GUESS_GIVEN',
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

    this.db.doc<Game>('games/' + gamename)
      .set(request)
      .then(() => alert('Successful'))
      .catch(() => alert('fail'));
  }

  updateSinglePlayerScore() {
    const request = {};
    request[players.playerA.uid] = {
      pointsScored: {
        total: 667
      }
    };
    this.db.collection<PlayerProfile>('games/')
      .doc(gamename)
      .collection('/players/')
      .add(request)
      .then(result => console.log('done'));
  }

  addInitialWords() {
    const cards = [];
    let pos = 0;
    const batch = this.db.firestore.batch();
    for (const word of this.linpCardsModelService.getCards()) {

      const singleCard = {
        random: this.random53(),
        value: word
      };

      cards.push(singleCard);

      this.db.collection('words')
        .doc('de')
        .collection('cards')
        .add(singleCard)
        .then(result => console.log('done'));

      console.log(singleCard.random);
      pos++;
    }

    this.db.collection('words')
      .doc('de')
      .set({size: cards.length});


    /*
        this.db
          .collection('words')
          .doc('size')
          .set({'de' : cards.length})
      */
  }

  public testQuery() {
    const random = this.random53();
    console.log('called ' + random);
    this.queryResults = this.db
      .collection('words')
      .doc('de')
      .collection('cards', (ref) => {
        console.log('collection');
        return ref
          .where('random', '<', random)
          .orderBy('random', 'desc')
          // .startAt(3)
          .limit(2)
      }).valueChanges();
  }


  private random53(): number {
    return Math.floor(Number.MAX_SAFE_INTEGER * (2 * (Math.random() - 0.5)));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
