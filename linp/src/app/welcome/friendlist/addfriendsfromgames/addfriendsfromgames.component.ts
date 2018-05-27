import {Component, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {FirebaseGameService} from "../../../services/firebasegame.service";
import {PlayerFriendlist} from "../../../models/player";
import {GamePlayer} from "../../../models/game";
import {FriendlistComponent} from "../friendlist.component";
import {NgbPopover} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-addfriendsfromgames',
  templateUrl: './addfriendsfromgames.component.html',
  styleUrls: ['./addfriendsfromgames.component.scss']
})
export class AddfriendsfromgamesComponent implements OnInit {

  @Input() public gamePlayers: GamePlayer[];

  @ViewChild('addFriendDropdown') public addFriendDropdown: NgbPopover;

  public friendList: GamePlayer[] = null;
  private loggedInGamePlayer : GamePlayer = null;
  private clickedOnceButton = false;

  constructor(private route: ActivatedRoute,
              private firebaseGameService: FirebaseGameService) { }

  ngOnInit() {
    // const gamePlayerUids: string[] = JSON.parse(this.route.snapshot.queryParamMap.get('gamePlayerUids'));

  }

  public clickedOnAddFriendlistButton(){
    this.loggedInGamePlayer = this.gamePlayers.find(player => player.uid === this.firebaseGameService.getAuthUid());

    if(this.clickedOnceButton === false){
      this.firebaseGameService.observeCurrentPlayersFriendslist()
        .subscribe(playerFriends => {
         // const friendsUids = playerFriends.map(friend => friend.uid);

          const result = this.gamePlayers.filter(gamePlayer => {
            return playerFriends.find((friend) => {
              return gamePlayer.uid === friend.uid;
            }) === undefined;
          });
          this.friendList = result.filter(player => player.uid !== this.firebaseGameService.getAuthUid());
          if(this.friendList.length === 0){
            debugger;
            this.addFriendDropdown.close();
          }
        })
    }
    this.clickedOnceButton = true;
  }

  public onFriendSelection(friend){
    this.firebaseGameService.addCurrentUserAsFriendToOtherPlayer(friend.uid, this.loggedInGamePlayer.name);
    this.firebaseGameService.addFriendToCurrentUser(friend.uid, this.loggedInGamePlayer.name);
  }

}
