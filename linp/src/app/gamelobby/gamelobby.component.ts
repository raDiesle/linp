import { PlayerFriendlist } from './../models/player.d';
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import { Game, GamePlayer, GameStatus } from '../models/game';
import { Subject } from 'rxjs/Subject';
import { GamelobbyService } from './gamelobby-service';
import { FirebaseGameService } from '../services/firebasegame.service';
import { PlayerProfile } from '../models/player';
import { WindowRef } from '../WindowRef';

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit, OnDestroy {

  friendList: PlayerFriendlist[] = [];
  isGameDataFetchedFlag = false;
  gamePlayerKeys: string[] = [];
  readonly NEXT_PAGE: GameStatus = 'preparegame';

  gameName: string;
  // TODO https://cedvdb.github.io/ng2share/
  gamePlayers: GamePlayer[] = []; // null
  staticAlertClosed = true;
  private authUserUid: string;
  private hostUid: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private loggedInPlayerIsHost = false;
  private hostPlayer: GamePlayer;
  public loggedInPlayerSuccessfulAddedStatusFlag = false;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private gamelobbyService: GamelobbyService,
    private firebaseGameService: FirebaseGameService,
    @Inject(WindowRef) private windowRef: WindowRef) {
  }

  ngOnInit(): void {
    const gameName = this.route.snapshot.paramMap.get('gamename');
    this.gameName = gameName;

    this.firebaseGameService.observeCurrentPlayersFriendslist()
      .subscribe(friendList => this.friendList = friendList);

    const observable = this.firebaseGameService.observeGame(this.gameName);
    observable
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        const isDevelopmentEnv = this.windowRef.nativeWindow.location.host.includes('localhost');
        this.router.navigate(['/' + game.status, this.gameName], {skipLocationChange: isDevelopmentEnv === false});
        this.gamePlayerAction(observable);
      });
  }

  private gamePlayerAction(observable): any {
    observable.first().toPromise()
    .then(() => {
      this.isGameDataFetchedFlag = true;

      this.firebaseGameService.observeGamePlayers(this.gameName)
        .takeUntil(this.ngUnsubscribe)
        .subscribe((gamePlayers: GamePlayer[]) => {
          this.gamePlayers = gamePlayers;
          this.hostPlayer = gamePlayers.find(gamePlayr => {
            return gamePlayr.isHost;
          });
          const loggedInUser = gamePlayers.find(gamePlayr => {
            return gamePlayr.uid === this.firebaseGameService.authUserUid;
          });

          this.loggedInPlayerIsHost = loggedInUser && loggedInUser.isHost;

          const isAlreadyJoined = loggedInUser !== undefined;
          if (isAlreadyJoined === false) {
            this.firebaseGameService.addLoggedInPlayerToGame(this.gameName)
              .then(() => {
                // if page changes e.g. in test before handler, it will show new user, but not persist to db
                this.loggedInPlayerSuccessfulAddedStatusFlag = true;
              });
          }
        });
    });
  }

  onFriendSelection(friend: PlayerFriendlist): void {
    this.firebaseGameService.addAPlayerToGame(this.gameName, friend.name, false, friend.uid)
      .then(() => {
        this.loggedInPlayerSuccessfulAddedStatusFlag = true;
      });
  }

  startGame(): void {
    this.firebaseGameService.updateGameStatus(this.NEXT_PAGE, this.gameName)
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
