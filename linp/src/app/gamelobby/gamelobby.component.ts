import {Component, OnInit} from '@angular/core';
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {Player} from "app/models/player";
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit {
  gamename: string;

  players: Player[]; // null
  numberOfWaitingDots: number = 3;
  waitingDots: number[] = [0, 1, 2];


  constructor(private router: Router,
              private route: ActivatedRoute,
              public db: AngularFireDatabase) {
  }

  ngOnInit(): void {
    this.gamename = this.route.snapshot.paramMap.get("gamename");

    let pathOrRef = "/games/" + this.gamename + "/players";
    console.log(pathOrRef);
    let dbPlayers = this.db.list(pathOrRef).subscribe(data => {
      this.players = <Player[]>data;
    });

    TimerObservable.create(0, 500).subscribe(t => {
      this.numberOfWaitingDots = this.numberOfWaitingDots + 1;
      this.waitingDots = Array.from(Array(this.numberOfWaitingDots % 4), (x, i) => i);
    });
  }

  startGame(): void {
    this.router.navigate(['/firsttip', this.gamename]);
  }

}
