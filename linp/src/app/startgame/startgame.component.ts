import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth';
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {Player} from "app/models/player";
import {Game} from "../models/game";
import * as firebase from 'firebase/app';

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
  playerName: string = "";
  gameName: string = "";
  private user: firebase.User;

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFireDatabase,
              public router: Router) {

    let dbGames = this.db.list("/games").subscribe(data => {
      this.games = data;
    });

    afAuth.authState.subscribe(data => {
      this.user = data;
      const firstName = data.displayName.split(" ")[0];
      this.playerName = firstName;
      this.gameName = firstName;
    });
  }

  ngOnInit() {
  }

  createGameAction(playerName: string, gameName: string): void {
    let dbGames = this.db.database.ref("games/" + gameName);

    let request = {
      host: playerName,
      name: gameName,
      players : {}
    };
    request.players[this.user.uid] = {
      uid : this.user.uid,
      name: playerName,
          status: "waiting"
    };

    dbGames.set(request);

    this.router.navigate(['/gamelobby', gameName]);
  }

  resetFilterResults() {
    this.hasAnyFilterHitted = false;
  }

  onSelect(game: Game): void {
    this.selectedGame = game;

    let playersRef = this.db.database.ref("games/" + game.name + "/players");
    let newPlayersKey = playersRef.push().key;

    let testSpieler : Player = {
      "name": this.playerName,
      "status": "Joined"
    };

    let updatePlayer = {};
    updatePlayer[newPlayersKey] = testSpieler;

    playersRef.update(updatePlayer);

    this.router.navigate(['/gamelobby', game.name]);
  }

  pageChanged(): void {

  }
}
