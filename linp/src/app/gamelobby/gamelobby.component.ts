import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs/Observable";
import {TimerObservable} from "rxjs/observable/TimerObservable";


const PLAYERS = [
  {
    name : "David"
  },
  {
    name : "Georg"
  }
];

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit {

  players = PLAYERS;
  numberOfWaitingDots :number = 3;
  waitingDots : number[] = [0, 1, 2];

  constructor() {
    TimerObservable.create(0 , 500).subscribe(t=>{
      this.numberOfWaitingDots = this.numberOfWaitingDots + 1;
      this.waitingDots = Array.from(Array(this.numberOfWaitingDots  % 4),(x,i)=>i);
    });
  }

  ngOnInit() {
  }

}
