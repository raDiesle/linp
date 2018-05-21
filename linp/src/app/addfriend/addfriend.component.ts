import { WindowRef } from './../WindowRef';
import { FirebaseGameService } from './../services/firebasegame.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Inject } from '@angular/core';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrls: ['./addfriend.component.scss']
})
export class AddfriendComponent implements OnInit, OnDestroy {

  public isFriendYourself = false;
  public newFriendsName: string = null;
  public isAddedSuccesful = false;

  constructor(
    @Inject(WindowRef) private windowRef: WindowRef,
    private router: Router,
    private route: ActivatedRoute,
    private firebaseGameService: FirebaseGameService
  ) {

  }

  ngOnInit() {
    const uid: string = this.route.snapshot.paramMap.get('uid');

    // TODO: its ugly, because he accesses data of other player.
    const addFriendToOriginUserPromise = this.firebaseGameService.observeLoggedInPlayerProfile().first().toPromise()
      .then(playerProfile => {

      // CHECK for non registered user call, new invited to linp
        const isFirstTimeRegisteredUser = playerProfile === null;
        if (isFirstTimeRegisteredUser) {
          this.router.navigate(['/playerprofile'], {
            queryParams: {
              callbackUrl : this.windowRef.nativeWindow.location.pathname
            },
            queryParamsHandling : 'merge'}
          );
        }

        return this.firebaseGameService.addCurrentUserAsFriendToOtherPlayer(uid, playerProfile.name);
      })

      // will be called twice for new registered
    const addedCurrentUserPromise = this.firebaseGameService.observePlayerProfile(uid).first().toPromise()
      .then(playerProfile => {
        this.newFriendsName = playerProfile.name;
        return this.firebaseGameService.addFriendToCurrentUser(uid, playerProfile.name)
      });

    Promise.all([addedCurrentUserPromise, addFriendToOriginUserPromise])
      .then(response => {
        // this.router.navigate(['/welcome']);
        this.isAddedSuccesful = true;
        this.isFriendYourself = false;
      }).catch(reason => {
        this.isAddedSuccesful = false;
        this.isFriendYourself = true;
      });
  }

  ngOnDestroy() { }

}
