import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase, FirebaseListObservable} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Router} from '@angular/router';
import {Game, GamePlayer} from '../models/game';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-startgame',
  templateUrl: './startgame.component.html',
  styleUrls: ['./startgame.component.css']
})
export class StartgameComponent implements OnInit {

  gameFilter = '';
  hasAnyFilterHitted = true;
  games: any = [];
  selectedGame: Game;

// @Input
  gameName = '';
  playerName: string;

  private authUser: firebase.User;

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFireDatabase,
              public router: Router) {


    this.db.list('/games')
      .subscribe(games => {
        this.games = games;
      });

    afAuth.authState
      .subscribe(authUser => {
        this.authUser = authUser;

        const uid = authUser.uid;
        this.db.object('/players/' + uid)
          .subscribe(playerProfile => {
            this.gameName = playerProfile.name;
            this.playerName = playerProfile.name;
          });
      });
  }

  ngOnInit() {
  }


  // To be extracted to service
  createGameAction(): void {
    const playerName = this.playerName;
    const gameName = this.gameName;

    // extract to model
    const request: Game = {
      host: playerName,
      name: gameName,
      players: {}
    };

    // extract to model
    request.players[this.authUser.uid] = {
      uid: this.authUser.uid,
      name: playerName,
      status: 'CREATED',
      pointsScored: {}
    };

    this.db.object('games/' + gameName)
      .set(<Game>request);

    this.router.navigate(['/gamelobby', gameName]);
  }

  resetFilterResults() {
    this.hasAnyFilterHitted = false;
  }

  onSelectGameToJoin(game: Game): void {
    this.selectedGame = game;

    // TODO extract to model
    const testSpieler: GamePlayer = {
      uid: this.authUser.uid,
      name: this.playerName,
      status: 'JOINED',
      pointsScored: {}
    };
    const updatePlayer = {};
    updatePlayer[this.authUser.uid] = testSpieler;

    this.db.object('games/' + game.name + '/players')
      .update(updatePlayer);
    this.router.navigate(['/gamelobby', game.name]);
  }
}
