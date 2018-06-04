import { GamePlayerSummary } from 'app/models/game';
import {Component, Input, OnInit} from '@angular/core';
import {GamePlayer} from '../../models/game';

@Component({
  selector: 'app-scorecard',
  templateUrl: './scorecard.component.html',
  styleUrls: ['./scorecard.component.scss']
})
export class ScorecardComponent implements OnInit {

  @Input()
  public gamePlayer: GamePlayerSummary;

  constructor() {
  }

  ngOnInit() {
  }

}
