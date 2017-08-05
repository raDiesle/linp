import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {GamePlayer} from "../models/game";

@Component({
  selector: 'app-firsttip',
  templateUrl: './firsttip.component.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit {
  user: firebase.User;
  players: GamePlayer[];
  gamename: string;


  //@input
  private firstSynonym: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {
    afAuth.authState.subscribe(data => {
      this.user = data;
    });
  }

  ngOnInit() {
    this.gamename = this.route.snapshot.paramMap.get("gamename");

    const statusToCheck = "FIRST_WORD_GIVEN";
    const nextPositiveRoute = "/firstguess";
    this.db.list("/games/" + this.gamename + "/players")
    // <GamePlayer[]>
      .subscribe(gamePlayerResponse => {
        this.players = gamePlayerResponse;
        this.observeGamePlayerStatus(gamePlayerResponse, statusToCheck, nextPositiveRoute);
      });
  }

  private observeGamePlayerStatus(gamePlayers, statusToCheck: string, nextPositiveRoute: string) {
    // change
    const doNothing = null;
    Observable.from(gamePlayers)
      .flatMap(p => Observable.of(p))
      .pluck("status")
      .every(status => status === statusToCheck)
      .subscribe(allGivenFirstSynonym =>
        allGivenFirstSynonym ? this.router.navigate([nextPositiveRoute, this.gamename]) : doNothing
      );
  }

  sendFirstSynonym() {
    const requestGamePlayerModel = {
      status: "FIRST_WORD_GIVEN",
      firstSynonym: this.firstSynonym
    };
    this.db.database.ref("games/" + this.gamename + "/players/" + this.user.uid)
      .update(requestGamePlayerModel);
  }
}
