import { ActivePlayerGame } from 'app/models/player';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GameStatus } from 'app/models/game';

@Component({
  selector: 'app-gamelist',
  templateUrl: './gamelist.component.html',
  styleUrls: ['./gamelist.component.scss']
})
export class GamelistComponent implements OnInit {

  @Input()
  public games: ActivePlayerGame[];

  @Input()
  public isPrimary: boolean;

  constructor(public router: Router) { }

  ngOnInit() {

  }

  public onSelectGameToJoin(gameName: string): void {
    this.router.navigate([<GameStatus>'gamelobby', gameName], {skipLocationChange: true});
  }

}
