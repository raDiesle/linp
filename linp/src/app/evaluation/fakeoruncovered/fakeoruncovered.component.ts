import { Component, OnInit, Input } from '@angular/core';
import { GamePlayer } from 'app/models/game';

@Component({
  selector: 'app-fakeoruncovered',
  templateUrl: './fakeoruncovered.component.html',
  styleUrls: ['./fakeoruncovered.component.scss']
})
export class FakeoruncoveredComponent implements OnInit {

  @Input()
  public gamePlayer: GamePlayer;

  constructor() { }

  ngOnInit() {
  }

}
