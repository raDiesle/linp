import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute} from "@angular/router";
import {AngularFireDatabase} from "angularfire2/database";
import {Player} from "../models/player";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-firsttip',
  templateUrl: './firsttip.component.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit {
  user: firebase.User;
  players: Player[];
  gamename: string;

  yourRoleWordAnimation: string;
  dots: string = "";
  //@input
  private firstSynonym: string;

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth
              ) {

    afAuth.authState.subscribe(data => {
      this.user = data;
    });

    var yourWordAnimation = ["your", "word", "to", "explain", "is", "_"];
//TODO      var yourRoleAnimation = ["YOU", "ARE", "THE", "? QUESTIONMARK ?"];

    yourWordAnimation.push("'House'");
    let source = Observable
      .interval(500)
      .timeInterval()
      .take(yourWordAnimation.length);
    source.subscribe((listItem) => {
      this.yourRoleWordAnimation = yourWordAnimation[listItem.value];
      this.changeDetectorRef.markForCheck();
    });

    let sourceLoading = Observable
      .interval(500)
      .timeInterval();
    sourceLoading.subscribe((counter) => {
      const dotSymbolList = [" ", ".", "..", "...", "...."];
      this.dots = dotSymbolList[counter.value % dotSymbolList.length];
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnInit() {
    this.gamename = this.route.snapshot.paramMap.get("gamename");

    let pathOrRef = "/games/" + this.gamename + "/players";
    let dbPlayers = this.db.list(pathOrRef).subscribe(data => {
      this.players = data;
    });
  }

  sendWord(){
    let dbGames = this.db.database.ref("games/" + this.gamename + "/players/" + this.user.uid);
    dbGames.update({
      status : "FIRST_WORD_GIVEN",
      firstWord : this.firstSynonym
    });

  }

}
