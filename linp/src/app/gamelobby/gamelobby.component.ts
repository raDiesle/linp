import {Component, OnInit} from '@angular/core';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Router, ActivatedRoute} from '@angular/router';
import {Player} from "app/models/player";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {Observable} from "rxjs/Observable";
import {max} from "rxjs/operator/max";
import {min} from "rxjs/operator/min";
import {FirebaseListFactoryOpts} from "angularfire2/interfaces";

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit {
  totalSizeOfWordCatalogue: any;

  gamename: string;

  players: Player[]; // null
  numberOfWaitingDots: number = 3;
  waitingDots: number[] = [0, 1, 2];
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
    this.gamename = this.route.snapshot.paramMap.get("gamename");

    let pathOrRef = "/games/" + this.gamename + "/players";
    console.log(pathOrRef);
    let dbPlayers = this.db.list(pathOrRef)
      .subscribe(data => {
        this.players = <Player[]>data;
      });

    TimerObservable.create(0, 500)
      .subscribe(t => {
        this.numberOfWaitingDots = this.numberOfWaitingDots + 1;
        this.waitingDots = Array.from(Array(this.numberOfWaitingDots % 4), (x, i) => i);
      });
  }

  startGame(): void {

    const numberOfWordsNeeded = 1;
    const numberOfQuestionMarks = 1;
    const QUESTIONMARK_ROLE = {
      value: "?"
    };

    let roleOrWordPool: string[] = Array(numberOfQuestionMarks).fill(QUESTIONMARK_ROLE);

    this.db.object('/words/size/en', {preserveSnapshot: true})
      .subscribe(totalSizeOfWordsDuplicatedReference => {
        this.totalSizeOfWordCatalogue = totalSizeOfWordsDuplicatedReference.val();

        const max = this.totalSizeOfWordCatalogue - numberOfWordsNeeded;
        const startPickWordsAtPos = Math.floor((Math.random() * max) + 1);
        const endPickWordsAtPos = startPickWordsAtPos + numberOfWordsNeeded;

        const query: FirebaseListFactoryOpts = {
          query: {
            startAt: startPickWordsAtPos,
            endAt: endPickWordsAtPos
          }
        };

// query
        var wordsRef = this.db.list("/words/en").subscribe(data => {
          let words = data.splice(startPickWordsAtPos, endPickWordsAtPos);

          roleOrWordPool = roleOrWordPool.concat(words);

          let shuffledPlayers = this.shuffle(this.players);
          for (let pos = 0; pos < shuffledPlayers.length; pos++) {
            // TODO not nice, because lengths have to exactly match
            shuffledPlayers[pos].word = roleOrWordPool[pos]["value"]; // fix value accessor
          }
          console.log("Afterswards to update back players to db:");
          console.log(shuffledPlayers);
    // TODO
//    this.router.navigate(['/firsttip', this.gamename]);
          return null;
        });
      });
  }

  private assignWordOrRoleToUserDB(userId: string, wordOrRole: string) {
    let dbGames = this.db.database.ref("games/" + this.gamename + "/players/" + userId);
    dbGames.update({
      status: "ROLE_OR_WORD_GIVEN",
      word: wordOrRole
    });
  }

  private shuffle(arrayToSort: any[]): any[] {
    return arrayToSort.sort(function () {
      return Math.random() - 0.5;
    });
  };
}
