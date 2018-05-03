import { Component, OnInit, Input } from '@angular/core';
import { GamePlayer } from '../../models/game';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.scss']
})
export class ScorecardComponent implements OnInit {

  @Input()
  gamePlayer: GamePlayer;

  constructor() { }

  ngOnInit() {
  }

}
