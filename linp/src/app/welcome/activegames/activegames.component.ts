import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Game, GameStatus} from 'app/models/game';
import {Subject} from 'rxjs/Subject';

import {FirebaseGameService} from '../../services/firebasegame.service';
import {ActivePlayerGame} from 'app/models/player';

@Component({
  selector: 'app-activegames',
  templateUrl: './activegames.component.html',
  styleUrls: ['./activegames.component.css'],
})
export class ActivegamesComponent implements OnInit, OnDestroy {

  passiveGames: ActivePlayerGame[] = null;
  public games: ActivePlayerGame[] = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public router: Router,
              private route: ActivatedRoute,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.firebaseGameService.observeActivegamesOfPlayer()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(activePlayerGames => {
        this.games = [];
        this.passiveGames = [];
        // rewrite to nice groupBy
        activePlayerGames.forEach(game => {
          game.isActionRequired ? this.games.push(game) : this.passiveGames.push(game);
        });
      });
  }

  onSelectGameToJoin(gameName: string): void {
    this.router.navigate([<GameStatus>'gamelobby', gameName], {skipLocationChange: true});
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
