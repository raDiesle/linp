import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Router} from '@angular/router';
import {Game, GamePlayer, GameStatus, PointsScored} from 'app/models/game';
import {Subject} from 'rxjs/Subject';

import {FirebaseGameService} from '../services/firebasegame.service';


@Component({
  selector: 'app-joingame',
  templateUrl: './joingame.component.html',
  styleUrls: ['./joingame.component.css'],
})
export class JoinGameComponent implements OnInit, OnDestroy {

  games: Game[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public router: Router,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.firebaseGameService.observePublicGamesToJoin()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(games => {
        this.games = games;
      });
  }

  onSelectGameToJoin(game: Game): void {
    this.router.navigate([<GameStatus>'gamelobby', game.name]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
