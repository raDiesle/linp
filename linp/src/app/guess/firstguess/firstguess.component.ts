import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {GamePlayer} from "../../models/game";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {GuessService} from "../guess.service";

@Component({
  selector: 'app-firstguess',
  templateUrl: './firstguess.component.html',
  styleUrls: ['./firstguess.component.css']
})
export class FirstguessComponent implements OnInit {
  authUser: firebase.User;
  gameName: any;

  selectedGamePlayers: GamePlayer[] = [];
  gamePlayers : {[uid : string] :  GamePlayer};
  private gamePlayerKeys: string[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              public guessService : GuessService
              ) {
    afAuth.authState.subscribe(data => {
      this.authUser = data;
    });
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get("gamename");
    this.db.object("/games/" + this.gameName + "/players")
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
      });
  }

  onTeamPlayerGuessSelected(clickedGamePlayer): void {
    //  TODO make it non modifyable with rxjs
    this.selectedGamePlayers = this.guessService.onTeamPlayerGuessSelected( { ...this.selectedGamePlayers}, clickedGamePlayer);
  }

  saveFirstTeamTip(): void {
    let createGuessModel = function (selectedGamePlayers) {
      const firstTeamTip = {
        firstPartner: {
          uid: selectedGamePlayers[0].uid,
        },
        secondPartner: {
          uid: selectedGamePlayers[1].uid,
        }
      };
      return firstTeamTip;
    };
// move to model
    const firstTeamTip = createGuessModel.call(this.selectedGamePlayers);
    const tipDBkey = "/firstTeamTip";
    this.db.database.ref("games/" + this.gameName + "/players/" + this.authUser.uid + tipDBkey)
      .set(firstTeamTip);
  }

}
