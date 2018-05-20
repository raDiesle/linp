import { PlayerFriendlist } from './../models/player.d';
import { Component, OnDestroy, OnInit, Inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import { Game, GamePlayer, GameStatus } from '../models/game';
import { Subject } from 'rxjs/Subject';
import { GamelobbyService } from './gamelobby-service';
import { FirebaseGameService } from '../services/firebasegame.service';
import { PlayerProfile } from '../models/player';
import { WindowRef } from '../WindowRef';
import { ActionguideService, ActionguideDto } from '../services/actionguide.service';

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
  private authUserUid: string;
  private hostUid: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private loggedInPlayerIsHost = false;
  private hostPlayer: GamePlayer;
  public loggedInPlayerSuccessfulAddedStatusFlag = false;
  private clickedStartButton = false;


  constructor(private router: Router,
    private route: ActivatedRoute,
    private gamelobbyService: GamelobbyService,
    private firebaseGameService: FirebaseGameService,
    @Inject(WindowRef) private windowRef: WindowRef,
    private location: Location,
    private actionguideService: ActionguideService
  ) {
  }

  ngOnInit(): void {
    const gameName = this.route.snapshot.paramMap.get('gamename');
    this.gameName = gameName;

    this.firebaseGameService.observeCurrentPlayersFriendslist()
      .subscribe(friendList => this.friendList = friendList);

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        const isDevelopmentEnv = this.windowRef.nativeWindow.location.host.includes('localhost');
        const currentRouteName = this.route.snapshot.url[0].path;
        if (game.status === currentRouteName) {
          this.location.go(`gamelobby/${this.gameName}`);
        } else {
          this.router.navigate([`/${game.status}`, this.gameName], { skipLocationChange: isDevelopmentEnv === false });
          return;
        }

        // rewrite. warning about infinite loop
        if (this.isGameDataFetchedFlag === false) {
          this.gamePlayerAction();
        }
      });
  }

  private gamePlayerAction(): any {
    // TODO refactor to add host at game creation
    this.isGameDataFetchedFlag = true;

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((gamePlayers: GamePlayer[]) => {
        this.gamePlayers = gamePlayers;
        this.hostPlayer = gamePlayers.find(gamePlayr => gamePlayr.isHost);
        const loggedInUser = gamePlayers.find(gamePlayr => gamePlayr.uid === this.firebaseGameService.getAuthUid());
        this.loggedInPlayerIsHost = loggedInUser && loggedInUser.isHost;

        let everythingLoadedPromise = Promise.resolve();
        const isAlreadyJoined = loggedInUser !== undefined;
        if (isAlreadyJoined === false) {
          everythingLoadedPromise = this.firebaseGameService.addLoggedInPlayerToGame(this.gameName)
            .then(() => {
              this.loggedInPlayerSuccessfulAddedStatusFlag = true;
            });
        }

        everythingLoadedPromise.then(() => {

          if (this.loggedInPlayerIsHost === false) {
            this.actionguideService.triggerActionDone();
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
    this.clickedStartButton = true;
    this.firebaseGameService.updateGameStatus(this.NEXT_PAGE, this.gameName)
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
