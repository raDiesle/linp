import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Game, GameStatus} from 'app/models/game';
import {Subject} from 'rxjs/Subject';

import {FirebaseGameService} from '../services/firebasegame.service';


@Component({
  selector: 'app-joingame',
  templateUrl: './joingame.component.html',
  styleUrls: ['./joingame.component.css'],
})
export class JoinGameComponent implements OnInit, OnDestroy {

  hasNoFriends = false;
  privateFriendGames: Game[] = null;
  publicGames: Game[] = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public router: Router,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {

    this.firebaseGameService.observePublicGamesToJoin()
      .subscribe((games) => {
        this.publicGames = games;
        return Promise.resolve(games);
      });

    const friendListPromise = this.firebaseGameService.observeCurrentPlayersFriendslist().first().toPromise()
      .then((playerFriendlist) => {
        this.hasNoFriends = playerFriendlist.length === 0;
        const friendsUids = playerFriendlist.map(friend => friend.uid);
        return Promise.resolve(friendsUids);
      });

    const activeGamesPromise = this.firebaseGameService.observeActivegamesOfPlayer().first().toPromise()
      .then((activeGamesOfLoggedInPlayer) => {
        const activeGameNames = activeGamesOfLoggedInPlayer.map(game => game.name);
        return Promise.resolve(activeGameNames);
      });

    const privateGamesPromise = this.firebaseGameService.observePrivateGamesToJoin().first().toPromise();

    Promise.all([privateGamesPromise, friendListPromise, activeGamesPromise])
      .then(results => {
        const publicGames = results[0];
        const friendsUids = results[1];
        const activeGameNames = results[2];
        const gamesOfFriendsHosted = publicGames.filter(game => friendsUids.includes(game.host));
        // const canBeJoinedGames = gamesOfFriendsHosted.filter(game => game.status === 'gamelobby');
        const notJoinedAlready = gamesOfFriendsHosted.filter(game => activeGameNames.includes(game.name) === false);
        this.privateFriendGames = notJoinedAlready;
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
