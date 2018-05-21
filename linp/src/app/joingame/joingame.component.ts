import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import { Router } from '@angular/router';
import { Game, GamePlayer, GameStatus, PointsScored } from 'app/models/game';
import { Subject } from 'rxjs/Subject';

import { FirebaseGameService } from '../services/firebasegame.service';


@Component({
  selector: 'app-joingame',
  templateUrl: './joingame.component.html',
  styleUrls: ['./joingame.component.css'],
})
export class JoinGameComponent implements OnInit, OnDestroy {

  hasNoFriends = false;
  privateGames: Game[] = null;
  publicGames: Game[] = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public router: Router,
    private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {

    this.firebaseGameService.observeCurrentPlayersFriendslist()
      .takeUntil(this.ngUnsubscribe)
      .subscribe((playerFriendlist) => {
        this.hasNoFriends = playerFriendlist.length === 0;
        // Hack to register subsequent observable once
        if (this.hasNoFriends || this.privateGames !== null) {
          this.privateGames = [];
          return;
        }
        const friendsUids = playerFriendlist.map(friend => friend.uid);

        // needs to filter for conditions, on client
        this.firebaseGameService.observeFriendsGamesToJoin(friendsUids)
          .then(gamesOfFriends => {
            const gamesOfFriendsNotStarted = gamesOfFriends.filter(game => game.status === 'gamelobby');
            if (gamesOfFriends.length === 0) {
              this.privateGames = [];
              return;
            }
            // filter which you haven't joined yet
            this.firebaseGameService.observeActivegamesOfPlayer().first().toPromise()
              .then((activeGamesOfLoggedInPlayer) => {
                const activeGameNames = activeGamesOfLoggedInPlayer.map(game => game.name);
                this.privateGames = gamesOfFriendsNotStarted.filter(game => activeGameNames.includes(game.name) === false);
              });
          });
      });

    this.firebaseGameService.observePublicGamesToJoin()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(games => {
        this.publicGames = games;
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
