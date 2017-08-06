import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireDatabase} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {GamePlayer, GameStatus} from "../../models/game";

@Component({
  selector: 'app-firsttip',
  templateUrl: './firsttip.component.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit {
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

    const statusToCheck : GameStatus= "FIRST_WORD_GIVEN";
    const nextPositiveRoute = "/firstguess";
    this.db.object("/games/" + this.gameName + "/players")
    // <GamePlayer[]>
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
        this.observeGamePlayerStatus(gamePlayers, statusToCheck, nextPositiveRoute);
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

  sendSynonym() {
    const requestGamePlayerModel = {
      status: "FIRST_WORD_GIVEN",
      firstSynonym: this.synonym
    };
    this.db.database.ref("games/" + this.gameName + "/players/" + this.authUser.uid)
      .update(requestGamePlayerModel)
      .then(gamePlayerModel => alert("Successful saved"));
  }
}
