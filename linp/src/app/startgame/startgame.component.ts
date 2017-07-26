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

  items: FirebaseListObservable<any[]>;
  user: Observable<firebase.User>;

  gamesOffset :number = 5;

  gameFilter : string = "";
  hasAnyFilterHitted : boolean = true;
  games: Game[] = GAMES;
  selectedGame: Game;
  currentPage : number = 1;
  totalItems : number = 64;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase
  ) {
    this.items = db.list('/items');
    this.user = afAuth.authState;
  }

  ngOnInit() {
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
