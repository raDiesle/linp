import {AngularFireAuth} from 'angularfire2/auth/auth';

import {FirebaseGameService} from './../../services/firebasegame.service';
import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {PlayerFriendlist} from '../../models/player';
import {WindowRef} from '../../WindowRef';

@Component({
  selector: 'app-friendlist',
  templateUrl: './friendlist.component.html',
  styleUrls: ['./friendlist.component.scss']
})
export class FriendlistComponent implements OnInit, OnDestroy {

  friendlist: PlayerFriendlist[] = null;
  public friendsinvitationlink = '/';
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private firebaseGameService: FirebaseGameService,
              private afAuth: AngularFireAuth,
              @Inject(WindowRef) private windowRef: WindowRef
  ) {
  }

  ngOnInit() {
    this.firebaseGameService.observeCurrentPlayersFriendslist()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(friendlist => {
        this.friendlist = friendlist;
      });

    this.friendsinvitationlink = `${this.windowRef.nativeWindow.location.origin}/addfriend/${this.afAuth.auth.currentUser.uid}`;

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
