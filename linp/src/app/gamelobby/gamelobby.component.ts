import {Component, OnInit} from '@angular/core';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Router, ActivatedRoute} from '@angular/router';
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {FirebaseListFactoryOpts} from "angularfire2/interfaces";

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit {
  gamePlayerKeys: string[] = [];
  totalSizeOfWordCatalogue: any;

  gameName: string;

  gamePlayers: any; // null
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
    this.gameName = this.route.snapshot.paramMap.get("gamename");

    this.db.object("/games/" + this.gameName + "/players")
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
        alert("Player size not expected");
    }
    const QUESTIONMARK_ROLE = {
      value: "?"
    };

    let questionmarkOrWordPool: string[] = Array(numberOfQuestionMarks).fill(QUESTIONMARK_ROLE);

    const language = 'en';
    const pathOrRef = '/words/size/' + language;
    this.db.object(pathOrRef, {preserveSnapshot: true})
      .subscribe(totalSizeOfWordsDuplicatedReference => {
        this.totalSizeOfWordCatalogue = totalSizeOfWordsDuplicatedReference.val();

        const max = this.totalSizeOfWordCatalogue - numberOfWordsNeeded;
        const startPickWordsAtPos = Math.floor((Math.random() * max) + 1);
        const endPickWordsAtPos = startPickWordsAtPos + numberOfWordsNeeded - 1;

        const query: FirebaseListFactoryOpts = {
          query: {
            startAt: startPickWordsAtPos,
            endAt: endPickWordsAtPos
          }
        };

// query
        this.db.list("/words/en").subscribe(wordsFullLibrary => {
          // optimize
          let wordsChosenFromLibrary = wordsFullLibrary.splice(startPickWordsAtPos, endPickWordsAtPos);
          let wordsDuplicatedForTeams = wordsChosenFromLibrary.concat(wordsChosenFromLibrary);
          //TODO duplicate words * 2 for every player
          questionmarkOrWordPool = questionmarkOrWordPool.concat(wordsDuplicatedForTeams);

          let shuffledWordPool = this.shuffle(questionmarkOrWordPool);
          // TODO not nice, because lengths have to exactly match
          for (let pos = 0; pos < this.gamePlayerKeys.length; pos++) {
            this.gamePlayers[this.gamePlayerKeys[pos]].word = shuffledWordPool[pos]["value"]; // fix value accessor
          }
          console.log(this.gamePlayers);
          this.assignWordOrRoleToUserDB(this.gamePlayers);
          // TODO animation

          this.router.navigate(['/firsttip', this.gameName]);
          return null;
        });
      });
  }

  private assignWordOrRoleToUserDB(players): void {
    let dbGames = this.db.database.ref("games/" + this.gameName + "/players");
    dbGames.set(players);
  }

  private shuffle(arrayToSort: any[]): any[] {
    return arrayToSort.sort(function () {
      return Math.random() - 0.5;
    });
  };
}
