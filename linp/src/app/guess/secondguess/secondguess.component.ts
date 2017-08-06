import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireDatabase} from "angularfire2/database";
import {GamePlayer, TeamTip} from "../../models/game";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';
import {GuessService} from "../guess.service";

@Component({
  selector: 'app-secondguess',
  templateUrl: './secondguess.component.html',
  styleUrls: ['./secondguess.component.css']
})
export class SecondguessComponent implements OnInit {

  authUser: firebase.User;
  gameName: string;

  selectedGamePlayers: GamePlayer[] = [];
  gamePlayers: { [uid: string]: GamePlayer };
  gamePlayerKeys: string[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              public guessService: GuessService) {
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
    //  TODO make it non modifyable with rxjs, { ...this.selectedGamePlayers}
    this.selectedGamePlayers = this.guessService.onTeamPlayerGuessSelected(this.selectedGamePlayers, clickedGamePlayer);
  }

  savesecondTeamTip(): void {
    let createGuessModel = function (selectedGamePlayers) {
      const firstTeamTip : TeamTip= {
        firstPartner: {
          uid: selectedGamePlayers[0].uid,
          name: selectedGamePlayers[0].name
        },
        secondPartner: {
          uid: selectedGamePlayers[1].uid,
          name : selectedGamePlayers[0]
        }
      };
      return secondTeamTip;
    };
// move to model
    const secondTeamTip = createGuessModel(this.selectedGamePlayers);
    const tipDBkey = "/secondTeamTip";
    this.db.database.ref("games/" + this.gameName + "/players/" + this.authUser.uid + tipDBkey)
      .set(secondTeamTip)
      .then(secondTeamTip => {
        alert("Successful saved choice");
      });
  }
}
