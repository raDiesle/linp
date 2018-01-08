import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Game} from '../models/game';
import {PlayerProfile} from '../models/player';
import {Subject} from 'rxjs/Subject';
import {LinpCardsModelService} from './linpcardsinit.service';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {FirebaseGameService} from '../services/firebasegame.service';
import {EvaluationMock} from './EvaluationMock';
import {PreparegameMock} from './PreparegameMock';
import {FirstGuessMock} from "./FirstGuessMock";

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
export class SimulationComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private queryResults: Observable<{}[]>;
  private createForPrepareGameResponseCount = 0;
  public createForPrepareGameResponseCountPlayersCount = 0;
  private gameName: string | null;
  private deletedGameFlag = false;
  private createForFirstGuessGameResponseCountPlayersCount = 0;
  private createForFirstGuessGameResponseCount = 0;

  constructor(private route: ActivatedRoute,
              public afAuth: AngularFireAuth,
              public db: AngularFirestore,
              public linpCardsModelService: LinpCardsModelService,
              public firebaseGameService: FirebaseGameService
              ) {
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
    EvaluationMock(players);
  }

  createForPrepareGame() {
   const requestObject = PreparegameMock(players);

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
            .set(player).then(() => {
            this.createForPrepareGameResponseCount++;
          })
        });
      })
      .catch(() => alert('fail'));

  }

  updateSinglePlayerScore() {
    const request = {};
    request[players.playerA.uid] = {
      pointsScored: {
        total: 667
      }
    };
    this.db
      .collection<PlayerProfile>('games')
      .doc(this.gameName)
      .collection('players')
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
        return ref
          .where('random', '<', random)
          .orderBy('random', 'desc')
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

  createForFirstGuessGame() {
    const requestObject = FirstGuessMock(players);

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
            .set(player).then(() => {
            this.createForPrepareGameResponseCount++;
          })
        });
      })
      .catch(() => alert('fail'));
  }
}
