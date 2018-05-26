import {PlayerFriendlist} from './../models/player';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Location} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {GamePlayer, GameStatus} from 'app/models/game';
import {Subject} from 'rxjs/Subject';
import {FirebaseGameService} from '../services/firebasegame.service';
import {WindowRef} from '../WindowRef';

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit, OnDestroy {

  public showPublicVisibilityTooltipChanged = false;
  public friendList: PlayerFriendlist[] = [];
  public isGameDataFetchedFlag = false;

  readonly NEXT_PAGE: GameStatus = 'preparegame';

  gameName: string;
  // TODO https://cedvdb.github.io/ng2share/
  gamePlayers: GamePlayer[] = []; // null
  public loggedInPlayerIsHost = false;
  public loggedInPlayerSuccessfulAddedStatusFlag = false;
  public isPrivate = true;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private hostPlayer: GamePlayer;
  private clickedStartButton = false;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private firebaseGameService: FirebaseGameService,
              @Inject(WindowRef) private windowRef: WindowRef,
              private location: Location
  ) {
  }

  ngOnInit(): void {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
    const isDevelopmentEnv = this.windowRef.nativeWindow.location.host.includes('localhost');
    const currentRouteName = this.route.snapshot.url[0].path;

    this.firebaseGameService.observeCurrentPlayersFriendslist()
      .subscribe(friendList => this.friendList = friendList);

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        this.isPrivate = game.visibilityPrivate;

        if (game.status === currentRouteName) {
          this.location.go(`gamelobby/${this.gameName}`);
        } else {
          this.router.navigate([`/${game.status}`, this.gameName], {skipLocationChange: isDevelopmentEnv === false});
          return;
        }

        // rewrite. warning about infinite loop
        if (this.isGameDataFetchedFlag === false) {
          this.gamePlayerAction();
        }
      });
  }

  public onFriendSelection(friend: PlayerFriendlist): void {
    this.firebaseGameService.addAPlayerToGame(this.gameName, friend.name, false, friend.uid)
      .then(() => {
        this.loggedInPlayerSuccessfulAddedStatusFlag = true;
      });
  }

  public startGame(): void {
    this.clickedStartButton = true;
    this.firebaseGameService.updateGameStatus(this.NEXT_PAGE, this.gameName)
  }

  public switchGameVisibilityToPrivate(isPrivate: boolean) {
    this.firebaseGameService.updateGameVisibility(isPrivate, this.gameName);
    this.isPrivate = isPrivate;
    this.showPublicVisibilityTooltipChanged = true;
  }

  private gamePlayerAction(): void {
    // TODO refactor to add host at game creation
    this.isGameDataFetchedFlag = true;

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((gamePlayers: GamePlayer[]) => {
        this.gamePlayers = gamePlayers;
        this.hostPlayer = gamePlayers.find(gamePlayr => gamePlayr.isHost);
        const loggedInUser = gamePlayers.find(gamePlayr => gamePlayr.uid === this.firebaseGameService.getAuthUid());
        this.loggedInPlayerIsHost = loggedInUser && loggedInUser.isHost;

        const isAlreadyJoined = loggedInUser !== undefined;
        if (isAlreadyJoined === false) {
         this.firebaseGameService.addLoggedInPlayerToGame(this.gameName)
            .then(() => {
              this.loggedInPlayerSuccessfulAddedStatusFlag = true;
            });
        }
      });
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
