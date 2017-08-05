import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {Game, GamePlayer} from "../models/game";
import * as firebase from 'firebase/app';
import {PlayerProfile} from "../models/player";

@Component({
  selector: 'app-startgame',
  templateUrl: './startgame.component.html',
  styleUrls: ['./startgame.component.css']
})
export class StartgameComponent implements OnInit {

  gameFilter: string = "";
  hasAnyFilterHitted: boolean = true;
  games: any = [];
  selectedGame: Game;

//@Input
  gameName: string = "";
  playerName : string;

  private user: firebase.User;

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFireDatabase,
              public router: Router) {


    this.db.list("/games").subscribe(data => {
      this.games = data;
    });

    afAuth.authState.subscribe(data => {
      this.user = data;

      const uid = data.uid;
      this.db.object("/players/" + uid).subscribe(playerProfileResponse => {
        this.gameName = playerProfileResponse.name;
        this.playerName = playerProfileResponse.name;
      });
    });
  }

  ngOnInit() {
  }


  // To be extracted to service
  createGameAction(playerName: string, gameName: string): void {
    let dbGames = this.db.database.ref("games/" + gameName);

    // extract to model
    let request: Game = {
      host: playerName,
      name: gameName,
      players: {}
    };

    // extract to mdoel
    request.players[this.user.uid] = {
      uid: this.user.uid,
      name: playerName,
      status: "CREATED"
    };

    dbGames.set(<Game>request);

    this.router.navigate(['/gamelobby', gameName]);
  }

  resetFilterResults() {
    this.hasAnyFilterHitted = false;
  }

  onSelect(game: Game): void {
    this.selectedGame = game;

    // extract to model
    let testSpieler: GamePlayer = {
      uid: this.user.uid,
      name: this.playerName,
      status: "JOINED"
    };
    let updatePlayer = {};
    updatePlayer[this.user.uid] = testSpieler;

    this.db.database.ref("games/" + game.name + "/players")
      .update(updatePlayer);
    this.router.navigate(['/gamelobby', game.name]);
  }
}
