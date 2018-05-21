import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Game, GamePlayer} from '../models/game';
import {PlayerProfile, ActivePlayerGame} from '../models/player';
import {Subject} from 'rxjs/Subject';
import {LinpCardsModelService} from './linpcardsinit.service';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {FirebaseGameService} from '../services/firebasegame.service';
import {EvaluationMock} from './EvaluationMock';
import {PreparegameMock} from './PreparegameAndFirstTipMock';
import {FirstGuessMock} from './FirstGuessMock';
import {SecondSynonymMock} from './SecondSynonymMock';
import {SecondGuessMock} from './SecondGuessMock';

const players: { [uid: string]: PlayerProfile } = {
  playerA: {
    uid: 'lnvb5qyrYJQ59ndQcNf5mlUXBpi2',
    name: 'playerA',
    uistates: {
      showHelpPopover: false,
      showShortDescription: false
    }
  },
  playerB: {
    uid: '79dcujI4LCcxClfJeWvse415gAq1',
    name: 'playerB',
    uistates: {
      showHelpPopover: false,
      showShortDescription: false
    }
  },
  playerC: {
    uid: 'MQx0kDr1wiceZIO6xAk6Ba2ICLB2',
    name: 'playerC',
    uistates: {
      showHelpPopover: false,
      showShortDescription: false
    }
  },
  playerD: {
    uid: 'DSDzE96HxSamuirC05NLNhN6x0z1',
    name: 'playerD',
    uistates: {
      showHelpPopover: false,
      showShortDescription: false
    }
  },
  playerE: {
    uid: 'UuS2hKP4BmhaqtLUA58bytDNMrZ2',
    name: 'playerE',
    uistates: {
      showHelpPopover: false,
      showShortDescription: false
    }
  },
  playerF: {
    uid: 'oVHSNM6pFvhkJ0QVQxetFMSFjJC2',
    name: 'playerF',
    uistates: {
      showHelpPopover: false,
      showShortDescription: false
    }
  }
};

@Component({
  selector: 'app-simulation',
  templateUrl: './simulation.component.html',
  styleUrls: ['./simulation.component.css']
})
export class SimulationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  public queryResults: Observable<{}[]>;
  public gameName: string | null;
  public deletedGameFlag = false;

  public createForSecondSynonymResponseCountPlayersCount = 0;
  public createForPrepareGameResponseCountPlayersCount = 0;

  public createForFirstGuessGameResponseCountPlayersCount = 0;
  public createForFirstGuessGameResponseCount = 0;
  public createForEvaluationResponseCountPlayersCount = 0;
  public createForPrepareGameResponseCount = 0;

  public createForSecondGuessGameResponseCount = 0;
  public createForSecondGuessGameResponseCountPlayersCount = 0;
  public createForSecondSynonymResponseCount = 0;
  public createForEvaluationResponseCount = 0;


  public createGaneWithUsers

  constructor(private route: ActivatedRoute,
              public afAuth: AngularFireAuth,
              public db: AngularFirestore,
              public linpCardsModelService: LinpCardsModelService,
              public firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
  }

  public deleteGame() {
    this.firebaseGameService.deleteGame(this.gameName)
      .then(() => {
        this.deletedGameFlag = true;
      });
  }

  createForEvaluation() {
    const requestObject = EvaluationMock(players, this.gameName);

    this.createForEvaluationResponseCountPlayersCount = requestObject.requestPlayers.length;
    this.createForEvaluationResponseCount = 0;

    this.db
      .collection<Game>('games')
      .doc(this.gameName)
      .set(requestObject.request)
      .then(() => {
        requestObject.requestPlayers.forEach(player => {
          this.db
            .collection<Game>('games')
            .doc(this.gameName)
            .collection('players')
            .doc(player.uid)
            .set(player)
            .then(() => {

              const activeGameModel = {
                name: this.gameName
              };
              this.db
              .collection<GamePlayer>('players')
              .doc(player.uid)
              .collection<ActivePlayerGame>('activegames')
              .doc(this.gameName)
              .set(activeGameModel)
              .then(() => {
                this.createForEvaluationResponseCount++;
              });
            })
        });
      })
      .catch(() => alert('fail'));
  }

  createForPrepareGame() {
    const requestObject = PreparegameMock(players, this.gameName);

    this.createForPrepareGameResponseCountPlayersCount = requestObject.requestPlayers.length;
    this.createForPrepareGameResponseCount = 0;

    this.db
      .collection<Game>('games')
      .doc(this.gameName)
      .set(requestObject.request)
      .then(() => {
        requestObject.requestPlayers.forEach(player => {
          this.db
            .collection<Game>('games')
            .doc(this.gameName)
            .collection('players')
            .doc(player.uid)
            .set(player)
            .then(() => {

              const activeGameModel: ActivePlayerGame = {
                name: this.gameName,
                isActionRequired: false,
                since: new Date().getTime()
              };
              const isPlayerToSimulateHeIsFirstPlayersTurn = player.name === 'playerB';
              if (isPlayerToSimulateHeIsFirstPlayersTurn) {
                activeGameModel.isActionRequired = true;
              }
              this.db
              .collection<GamePlayer>('players')
              .doc(player.uid)
              .collection<ActivePlayerGame>('activegames')
              .doc(this.gameName)
              .set(activeGameModel)
              .then(() => {
                this.createForPrepareGameResponseCount++;
              });
            })
        });
      })
      .catch(() => alert('fail'));
  }

  createForSecondSynonym() {
    const requestObject = SecondSynonymMock(players, this.gameName);

    this.createForSecondSynonymResponseCountPlayersCount = requestObject.requestPlayers.length;
    this.createForSecondSynonymResponseCount = 0;

    this.db
      .collection<Game>('games')
      .doc(this.gameName)
      .set(requestObject.request)
      .then(() => {
        requestObject.requestPlayers.forEach(player => {
          this.db
            .collection<Game>('games')
            .doc(this.gameName)
            .collection('players')
            .doc(player.uid)
            .set(player)
            .then(() => {

              const activeGameModel = {
                name: this.gameName
              };
              this.db
              .collection<GamePlayer>('players')
              .doc(player.uid)
              .collection<ActivePlayerGame>('activegames')
              .doc(this.gameName)
              .set(activeGameModel)
              .then(() => {
                this.createForSecondSynonymResponseCount++;
              });
            })
        });
      })
      .catch(() => alert('fail'));
  }

  createForFirstGuessGame() {
    const requestObject = FirstGuessMock(players, this.gameName);

    this.createForFirstGuessGameResponseCountPlayersCount = requestObject.requestPlayers.length;
    this.createForFirstGuessGameResponseCount = 0;

    this.db
      .collection<Game>('games')
      .doc(this.gameName)
      .set(requestObject.request)
      .then(() => {
        requestObject.requestPlayers.forEach(player => {
          this.db
            .collection<Game>('games')
            .doc(this.gameName)
            .collection('players')
            .doc(player.uid)
            .set(player)
            .then(() => {
              const activeGameModel: ActivePlayerGame = {
                name: this.gameName,
                isActionRequired: true,
                since: new Date().getTime()
              };
              this.db
              .collection<GamePlayer>('players')
              .doc(player.uid)
              .collection<ActivePlayerGame>('activegames')
              .doc(this.gameName)
              .set(activeGameModel)
              .then(() => {
                this.createForFirstGuessGameResponseCount++;
              });
            })
        });
      })
      .catch(() => alert('fail'));
  }

  createForSecondGuessGame() {
    const requestObject = SecondGuessMock(players, this.gameName);

    this.createForSecondGuessGameResponseCountPlayersCount = requestObject.requestPlayers.length;
    this.createForSecondGuessGameResponseCount = 0;

    this.db
      .collection<Game>('games')
      .doc(this.gameName)
      .set(requestObject.request)
      .then(() => {
        requestObject.requestPlayers.forEach(player => {
          this.db
            .collection<Game>('games')
            .doc(this.gameName)
            .collection('players')
            .doc(player.uid)
            .set(player)
            .then(() => {

              const activeGameModel: ActivePlayerGame = {
                name: this.gameName,
                isActionRequired: true,
                since: new Date().getTime()
              };
              this.db
              .collection<GamePlayer>('players')
              .doc(player.uid)
              .collection<ActivePlayerGame>('activegames')
              .doc(this.gameName)
              .set(activeGameModel)
              .then(() => {
                this.createForSecondGuessGameResponseCount++;
              });
            })
        });
      })
      .catch(() => alert('fail'));
  }

  updateSinglePlayerScore(): Promise<any> {
    const request = {};
    request[players.playerA.uid] = {
      pointsScored: {
        total: 667
      }
    };
    return this.db
      .collection<PlayerProfile>('games')
      .doc(this.gameName)
      .collection('players')
      .add(request);
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
        .add(singleCard);
        // wtf
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
    this.queryResults = this.db
      .collection('words')
      .doc('de')
      .collection('cards', (ref) => {
        return ref
          .where('random', '<', random)
          .orderBy('random', 'desc')
          .limit(2)
      }).valueChanges();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private random53(): number {
    return Math.floor(Number.MAX_SAFE_INTEGER * (2 * (Math.random() - 0.5)));
  }
}
