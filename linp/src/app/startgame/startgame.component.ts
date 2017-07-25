import {Component, OnInit} from '@angular/core';
import { SlicePipe } from '@angular/common';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

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


import * as firebase from 'firebase/app';

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

  hasGameFilterHitEntries(game : Game) : boolean{
    const hasHit = this.gameFilter === '' || (game.name).startsWith(this.gameFilter);
    this.hasAnyFilterHitted = this.hasAnyFilterHitted || !this.hasAnyFilterHitted && hasHit;
    return hasHit;
  }

  pageChanged() : void{

  }


}
