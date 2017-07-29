import {Component, OnInit} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import {Observable} from "rxjs/Observable";

interface Game {
  name: String;
}

const GAMES: Game[] =
  [
    {
      name: "Peter"
    },
    {
      name: "Heinz"
    },
    {
      name: "David"
    },
    {
      name: "Lina"
    },
    {
      name: "Ogre"
    },
    {
      name : "Peter"
    },
    ,
    {
      name : "Junior"
    },
    {
      name : "Georg"
    },
    {
      name : "Heinz"
    },
    {
      name : "Patrick"
    }
  ];

@Component({
  selector: 'app-startgame',
  templateUrl: './startgame.component.html',
  styleUrls: ['./startgame.component.css']
})
export class StartgameComponent implements OnInit {

  gamesOffset :number = 5;

  gameFilter : string = "";
  hasAnyFilterHitted : boolean = true;
  games: any = GAMES;
  selectedGame: Game;

//@Input
  playerName : string = "";
  gameName : string = "";

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
  ) {

    //this.items
    /*
    db.object('/games').subscribe(data => {
      this.games = data.value;
      console.log("__");
      console.log(data);
    });
    */
    let dbGames = this.db.list("/games").subscribe(data =>{
      this.games = data;
    });

    afAuth.authState.subscribe(data =>{
      const firstName = data.displayName.split(" ")[0];
      this.playerName = firstName;
      this.gameName = firstName;
    });
  }

  ngOnInit() {
  }

  createGameAction(playerName : string, gameName : string) : void{
    let dbGames = this.db.database.ref("games/" + gameName);
    dbGames.set({
      playerName : playerName,
      name : gameName
    });
  }

  resetFilterResults(){
    this.hasAnyFilterHitted = false;
  }

  onSelect(game) : void{
    this.selectedGame = game;
  }

  pageChanged() : void{

  }
}
