import {Game} from './../../models/game';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-gameslist',
  templateUrl: './gameslist.component.html',
  styleUrls: ['./gameslist.component.scss']
})
export class GameslistComponent implements OnInit {

  @Input() public games: Game[];

  constructor() {
  }

  ngOnInit() {
  }

}
