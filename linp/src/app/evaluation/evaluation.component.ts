import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from "angularfire2/auth";
import {ActivatedRoute} from "@angular/router";
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from "angularfire2/database";
import {GamePlayer} from "../models/game";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  authUser: firebase.User;
  gameName: string;
  gamePlayers: { [uid: string]: GamePlayer };
  gamePlayerKeys: string[];

  constructor(private route: ActivatedRoute,
              public afAuth: AngularFireAuth,
              public db: AngularFireDatabase,) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get("gamename");
    this.db.object("/games/" + this.gameName + "/players")
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
        this.evaluate();
      });
  }

  evaluate() : void{

    Observable.pairs(this.gamePlayers)
      .flatMap(p => Observable.of(p))
      .map(gamePlayer => {


        const gamePlayerObject = gamePlayer[1];
        const firstUID = gamePlayerObject["firstTeamTip"]["firstPartner"]["uid"];
        const secondUID = gamePlayerObject["firstTeamTip"]["firstPartner"]["uid"];

        const uid = gamePlayer[0];
        this.calculateScoresOfGuess(uid, firstUID, secondUID);
        return gamePlayer;
      }).subscribe(result=>{
        console.log(result)
    });
  }

  private calculateScoresOfGuess(uid : any, firstGuessUID: string, secondGuessUID: string) {
    const QUESTION_MARK = "?";
    const isFirstQuestionmark = this.gamePlayers[firstGuessUID].questionmarkOrWord === QUESTION_MARK;
    const isSecondQuestionmark = this.gamePlayers[firstGuessUID].questionmarkOrWord === QUESTION_MARK;

    const isWordsEqual = this.gamePlayers[firstGuessUID].questionmarkOrWord === this.gamePlayers[secondGuessUID].questionmarkOrWord;
    const isCorrectGuessOfTeamPartners = !isFirstQuestionmark && isWordsEqual;

    if(isCorrectGuessOfTeamPartners){
      this.gamePlayers[firstGuessUID].pointsScored -= 1;
      this.gamePlayers[uid].pointsScored += 1;
      this.gamePlayers[secondGuessUID].pointsScored -= 1;
      this.gamePlayers[uid].pointsScored += 1;
    }

    if(isFirstQuestionmark){
      this.gamePlayers[uid].pointsScored -= 1;
      this.gamePlayers[firstGuessUID].pointsScored += 1;
    }
    if(isSecondQuestionmark){
      this.gamePlayers[uid].pointsScored -= 1;
      this.gamePlayers[secondGuessUID].pointsScored += 1;
    }
  }
}
