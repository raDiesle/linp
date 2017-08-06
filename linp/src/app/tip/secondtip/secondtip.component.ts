import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {GamePlayer, GameStatus} from "../../models/game";

const GAME_STATUS : GameStatus = "SECOND_WORD_GIVEN";

@Component({
  selector: 'app-secondtip',
  templateUrl: './secondtip.component.html',
  styleUrls: ['./secondtip.component.css']
})
export class SecondtipComponent implements OnInit {
  gamePlayerKeys: string[];
  authUser: firebase.User;
  gamePlayers: { [uid: string]: GamePlayer };
  gameName: string;
  //@input
  private synonym: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(authUser => {
      this.authUser = authUser;
    });
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get("gamename");

    const nextPositiveRoute = "/secondguess";
    this.db.object("/games/" + this.gameName + "/players")
    // <GamePlayer[]>
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
        this.observeGamePlayerStatus(gamePlayers, GAME_STATUS, nextPositiveRoute);
      });
  }

  private observeGamePlayerStatus(gamePlayers: { [uid: string]: GamePlayer }, statusToCheck: string, nextPositiveRoute: string) {
    Observable.pairs(gamePlayers)
      .flatMap(p => Observable.of(p))
      .pluck("status")
      .every(status => status === statusToCheck)
      .subscribe(allGivenFirstSynonym => {
          // change
          const doNothing = null;
          allGivenFirstSynonym ? this.router.navigate([nextPositiveRoute, this.gameName]) : doNothing;
        }
      );
  }

  sendSecondSynonym() {
    const requestGamePlayerModel = {
      status: GAME_STATUS,
      secondSynonym: this.synonym
    };
    this.db.database.ref("games/" + this.gameName + "/players/" + this.authUser.uid)
      .update(requestGamePlayerModel)
      .then(gamePlayerModel => alert("Successful saved"));
  }

}
