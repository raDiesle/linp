import {Component, OnInit} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

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
    }
  ];

@Component({
  selector: 'app-startgame',
  templateUrl: './startgame.component.html',
  styleUrls: ['./startgame.component.css']
})
export class StartgameComponent implements OnInit {

  items: FirebaseListObservable<any[]>;

  gameFilter : string = "";
  hasAnyFilterHitted : boolean = true;
  games: Game[] = GAMES;
  selectedGame: Game;
  currentPage : number = 1;
  totalItems : number = 64;

  constructor(
    public db: AngularFireDatabase
  ) {
    this.items = db.list('/items');
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
