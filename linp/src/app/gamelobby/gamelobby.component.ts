import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {FirebaseListFactoryOpts} from 'angularfire2/interfaces';
import {GamePlayer} from '../models/game';

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit {
  gamePlayerKeys: string[] = [];
  totalSizeOfWordCatalogue: any;

  gameName: string;

  gamePlayers: { [uid: string]: GamePlayer }; // null
  private user: firebase.User;


  constructor(private router: Router,
              private route: ActivatedRoute,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {

    afAuth.authState.subscribe(data => {
      this.user = data;
    });
  }

  ngOnInit(): void {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.db.object('/games/' + this.gameName + '/players')
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
      });
  }

  startGame(): void {
    let numberOfWordsNeeded: number;
    let numberOfQuestionMarks: number;

    // expecting minimum 4
    const gamePlayerSize = this.gamePlayerKeys.length;
    switch (true) {
      case (gamePlayerSize <= 5):
        numberOfQuestionMarks = 1;
        numberOfWordsNeeded = 2;
        break;
      // for later refactoring explicit
      case(gamePlayerSize > 5 && gamePlayerSize <= 8):
        numberOfQuestionMarks = 2;
        numberOfWordsNeeded = gamePlayerSize / 2 - numberOfQuestionMarks;
        break;
      default:
        alert('Player size not expected');
    }
    const QUESTIONMARK_ROLE = {
      value: '?'
    };

    let questionmarkOrWordPool: string[] = Array(numberOfQuestionMarks).fill(QUESTIONMARK_ROLE);

    const language = 'en';
    const pathOrRef = '/words/size/' + language;
    this.db.object(pathOrRef, {preserveSnapshot: true})
      .subscribe(totalSizeOfWordsDuplicatedReference => {
        this.totalSizeOfWordCatalogue = totalSizeOfWordsDuplicatedReference.val();

        const maxPosForStartPick = this.totalSizeOfWordCatalogue - numberOfWordsNeeded -1;
        const startPickWordsAtPos = Math.floor((Math.random() * maxPosForStartPick) + 1);

        // TODO unused atm because not working
        const endPickWordsAtPos = startPickWordsAtPos + numberOfWordsNeeded - 1;
        const query: FirebaseListFactoryOpts = {
          query: {
            startAt: startPickWordsAtPos,
            endAt: endPickWordsAtPos
          }
        };

// query // might change to object. what if player adds word to database at same time with wrong primary key pos?
        this.db.list('/words/en').subscribe(wordsFullLibrary => {
          // optimize
          const wordsChosenFromLibrary = wordsFullLibrary.splice(startPickWordsAtPos, numberOfWordsNeeded);
          const wordsDuplicatedForTeams = wordsChosenFromLibrary.concat(wordsChosenFromLibrary);
          questionmarkOrWordPool = questionmarkOrWordPool.concat(wordsDuplicatedForTeams);

          const shuffledWordPool = this.shuffle(questionmarkOrWordPool);
          // TODO not nice, because lengths have to exactly match
          if (this.gamePlayerKeys.length !== shuffledWordPool.length) {
            alert('Unexpected error. Should match ' + this.gamePlayerKeys.length + '_' + shuffledWordPool.length);
            debugger;
          }
          for (let pos = 0; pos < this.gamePlayerKeys.length; pos++) {
            this.gamePlayers[this.gamePlayerKeys[pos]].questionmarkOrWord = shuffledWordPool[pos]['value']; // fix value accessor
          }
          this.assignWordOrRoleToUserDB(this.gamePlayers);
          // TODO animation

          this.router.navigate(['/firsttip', this.gameName]);
          return null;
        });
      });
  }

  private assignWordOrRoleToUserDB(players): void {
    this.db.database.ref('games/' + this.gameName + '/players')
      .set(players);
  }

  private shuffle(arrayToSort: any[]): any[] {
    return arrayToSort.sort(function () {
      return Math.random() - 0.5;
    });
  };
}
