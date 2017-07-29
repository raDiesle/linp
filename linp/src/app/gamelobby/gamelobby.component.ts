import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit {
  gamename: string;

  players = [];
  numberOfWaitingDots: number = 3;
  waitingDots: number[] = [0, 1, 2];


  constructor(private router: Router,
              private route: ActivatedRoute,
              public db: AngularFireDatabase
              ) {
  }

  ngOnInit(): void {
    this.gamename = this.route.snapshot.paramMap.get("gamename");

    let pathOrRef = "/games/" + this.gamename + "/players";
    console.log(pathOrRef);
    let dbPlayers = this.db.list(pathOrRef).subscribe(data =>{
      this.players = data;
    });

    TimerObservable.create(0, 500).subscribe(t => {
      this.numberOfWaitingDots = this.numberOfWaitingDots + 1;
      this.waitingDots = Array.from(Array(this.numberOfWaitingDots % 4), (x, i) => i);
    });

  }

}
