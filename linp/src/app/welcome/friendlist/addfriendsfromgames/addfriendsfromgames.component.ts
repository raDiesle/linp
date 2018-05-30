import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {FirebaseGameService} from '../../../services/firebasegame.service';
import {GamePlayer} from '../../../models/game';
import {NgbPopover, NgbPanelChangeEvent} from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ActivePlayerGame } from '../../../models/player';

@Component({
  selector: 'app-addfriendsfromgames',
  templateUrl: './addfriendsfromgames.component.html',
  styleUrls: ['./addfriendsfromgames.component.scss']
})
export class AddfriendsfromgamesComponent implements OnInit {

  public activePlayerGames: ActivePlayerGame[];
  @Input() public gamePlayers: GamePlayer[];
  public activePlayerName: string;

  public friendList: GamePlayer[] = null;
  private loggedInGamePlayer: GamePlayer = null;
  private clickedOnceButton = false;


  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.firebaseGameService.observeActivegamesOfPlayer()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(activePlayerGames => {
        this.activePlayerGames = activePlayerGames;
      });
  }

  public showFriends(gameName: string) {
    this.friendList = null;
   // const gameName = $event.panelId;
    this.activePlayerName = gameName;
    this.firebaseGameService.observeGamePlayers(gameName).first().toPromise()
    .then(gamePlayers => {
      this.gamePlayers = gamePlayers;
      this.clickedOnAddFriendlistButton();
    });
  }

  public clickedOnAddFriendlistButton() {
    this.loggedInGamePlayer = this.gamePlayers.find(player => player.uid === this.firebaseGameService.getAuthUid());

      this.firebaseGameService.observeCurrentPlayersFriendslist().first().toPromise()
        .then(playerFriends => {
          const result = this.gamePlayers.filter(gamePlayer => {
            return playerFriends.find((friend) => {
              return gamePlayer.uid === friend.uid;
            }) === undefined;
          });
          this.friendList = result.filter(player => player.uid !== this.firebaseGameService.getAuthUid());
        });
    }
    // this.clickedOnceButton = true;


  public onFriendSelection(friendToAdd) {
   // this.firebaseGameService.addCurrentUserAsFriendToOtherPlayer(friend.uid, this.loggedInGamePlayer.name);
    this.firebaseGameService.addFriendToCurrentUser(friendToAdd.uid, friendToAdd.name);
    this.friendList = this.friendList.filter(friend => friend.uid !== friendToAdd.uid);
  }

}
