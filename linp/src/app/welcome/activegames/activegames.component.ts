import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Router} from '@angular/router';
import {Game, GamePlayer, GameStatus, PointsScored} from '../../models/game';
import {Subject} from 'rxjs/Subject';

import {FirebaseGameService} from '../../services/firebasegame.service';
import { ActivePlayerGame } from 'app/models/player';


@Component({
  selector: 'app-activegames',
  templateUrl: './activegames.component.html',
  styleUrls: ['./activegames.component.css'],
})
export class ActivegamesComponent implements OnInit, OnDestroy {

  public games: ActivePlayerGame[] = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public router: Router,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.firebaseGameService.observeActivegamesOfPlayer()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(activePlayerGames => {
        this.games = activePlayerGames;
      });
  }

  onSelectGameToJoin(game: Game): void {
    this.router.navigate([<GameStatus>'gamelobby', game.name], {skipLocationChange: false});
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
