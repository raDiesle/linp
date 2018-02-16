import { PlayerFriendlist } from './../../models/game.d';
import { FirebaseGameService } from './../../services/firebasegame.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.scss']
})
export class FriendlistComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  friendlist: PlayerFriendlist[];

  constructor(public firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.firebaseGameService.observeFriendlist()
    .takeUntil(this.ngUnsubscribe)
    .subscribe(friendlist => {
      this.friendlist = friendlist;
    });

    /*
    TODO to add friends !!!
      uid: string;
      name: string;
      isOnline: boolean;
      lastOnline: number;
    */
  }

  openPrivateChat(friend: PlayerFriendlist) {
    alert('not yet implemented');
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
