import { Component, OnInit, Input } from '@angular/core';
import { GamePlayer, GamePlayerSummary } from 'app/models/game';

@Component({
  selector: 'app-playersum',
  templateUrl: './playersum.component.html',
  styleUrls: ['./playersum.component.scss']
})
export class PlayersumComponent implements OnInit {


  @Input()
  public gamePlayer: GamePlayerSummary;
  constructor() { }

  ngOnInit() {
  }

}
