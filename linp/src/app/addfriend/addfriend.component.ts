import { FirebaseGameService } from './../services/firebasegame.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrls: ['./addfriend.component.scss']
  // ,providers: [FirebaseGameService]
})
export class AddfriendComponent implements OnInit, OnDestroy {

  public isFriendYourself = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private firebaseGameService: FirebaseGameService,
    private window: Window
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
              callbackUrl : this.window.location.pathname
            },
            queryParamsHandling : 'merge'}
          );
        }

        this.firebaseGameService.addCurrentUserAsFriendToOtherPlayer(uid, playerProfile.name);
      })
      .catch(reason => {
        this.isFriendYourself = true;
        throw reason;
      });

      // will be called twice for new registered
    const addedCurrentUserPromise = this.firebaseGameService.observePlayerProfile(uid).first().toPromise()
      .then(playerProfile => {
        this.firebaseGameService.addFriendToCurrentUser(uid, playerProfile.name)
      })
      .catch(reason => {
        this.isFriendYourself = true;
        throw reason;
      });


    Promise.all([addedCurrentUserPromise, addFriendToOriginUserPromise])
      .then(response => {
        this.router.navigate(['/welcome']);
      }).catch(reason => -1)
  }

  ngOnDestroy() { }

}
