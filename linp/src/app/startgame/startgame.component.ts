import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


import * as firebase from 'firebase/app';

@Component({
  selector: 'app-startgame',
  templateUrl: './startgame.component.html',
  styleUrls: ['./startgame.component.css']
})
export class StartgameComponent implements OnInit {

  items: FirebaseListObservable<any[]>;


  constructor(
    public db: AngularFireDatabase
  ) {

    this.items = db.list('/items');
  }

  ngOnInit() {
  }

}
