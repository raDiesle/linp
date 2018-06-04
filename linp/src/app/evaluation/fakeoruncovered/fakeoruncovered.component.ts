import { Component, OnInit, Input } from '@angular/core';
import { GamePlayer, GamePlayerSummary } from 'app/models/game';

@Component({
  selector: 'app-fakeoruncovered',
  templateUrl: './fakeoruncovered.component.html',
  styleUrls: ['./fakeoruncovered.component.scss']
})
export class FakeoruncoveredComponent implements OnInit {

  @Input()
  public gamePlayer: GamePlayerSummary;

  constructor() { }

  ngOnInit() {
  }

}
