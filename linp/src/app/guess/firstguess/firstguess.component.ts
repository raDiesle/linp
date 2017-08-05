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
  user: firebase.User;
  gamename: any;

  selectedPlayers: GamePlayer[] = [];
  players = [];
  private playersKeys: string[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              public guessService : GuessService
              ) {

    afAuth.authState.subscribe(data => {
      this.user = data;
    });
  }

  ngOnInit() {
    this.gamename = this.route.snapshot.paramMap.get("gamename");
    this.db.object("/games/" + this.gamename + "/players")
      .subscribe(gamePlayerResponse => {
        this.players = gamePlayerResponse;
        this.playersKeys = Object.keys(this.players);
      });
  }

  onTeamPlayerGuessSelected(clickedGamePlayer): void {
    //  TODO make it non modifyable with rxjs
    this.selectedPlayers = this.guessService.onTeamPlayerGuessSelected( { ...this.selectedPlayers}, clickedGamePlayer);
  }

  saveFirstTeamTip(): void {
    let createGuessModel = function (selectedPlayers) {
      const firstTeamTip = {
        firstPartner: {
          uid: this.selectedPlayers[0].uid,
        },
        secondPartner: {
          uid: this.selectedPlayers[1].uid,
        }
      };
      return firstTeamTip;
    };
// move to model
    const firstTeamTip = createGuessModel.call(this.selectedPlayers);

    const tipDBkey = "/firstTeamTip";
    this.db.database.ref("games/" + this.gamename + "/players/" + this.user.uid + tipDBkey)
      .set(firstTeamTip);
  }

}
