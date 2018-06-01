import { GamePlayer } from 'app/models/game';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rolekey',
  templateUrl: './rolekey.component.html',
  styleUrls: ['./rolekey.component.scss']
})
export class RolekeyComponent implements OnInit {

  @Input()
  public gamePlayer: GamePlayer;

  constructor() { }

  ngOnInit() {
  }

}
