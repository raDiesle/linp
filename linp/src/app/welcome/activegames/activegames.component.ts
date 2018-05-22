import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import { Router, ActivatedRoute } from '@angular/router';
import { Game, GamePlayer, GameStatus, PointsScored } from 'app/models/game';
import { Subject } from 'rxjs/Subject';

import { FirebaseGameService } from '../../services/firebasegame.service';
import { ActivePlayerGame } from 'app/models/player';
import { ScrollToService, ScrollToConfigOptions } from '@nicky-lenaers/ngx-scroll-to';

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
    private firebaseGameService: FirebaseGameService,
    private scrollToService: ScrollToService) {
  }

  ngOnInit() {
    this.firebaseGameService.observeActivegamesOfPlayer()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(activePlayerGames => {
        this.games = [];
        this.passiveGames = [];
        // rewrite to nice groupBy
        const games = activePlayerGames.forEach(game => {
          game.isActionRequired ? this.games.push(game) : this.passiveGames.push(game);
        });
      });
  }

  onSelectGameToJoin(game: Game): void {
    this.router.navigate([<GameStatus>'gamelobby', game.name], { skipLocationChange: true });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
