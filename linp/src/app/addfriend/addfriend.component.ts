import { FirebaseGameService } from './../services/firebasegame.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-addfriend',
  templateUrl: './addfriend.component.html',
  styleUrls: ['./addfriend.component.scss']
})
export class AddfriendComponent implements OnInit, OnDestroy {

  public isFriendYourself = false;

  constructor(public router: Router,
    private route: ActivatedRoute,
    private firebaseGameService: FirebaseGameService
  ) { }

  ngOnInit() {
    const uid: string = this.route.snapshot.paramMap.get('uid');

    const addedCurrentUserPromise = this.firebaseGameService.observePlayerProfile(uid).first().toPromise()
      .then(playerProfile => this.firebaseGameService.addFriendToCurrentUser(uid, playerProfile.name))
      .catch(reason => {
        this.isFriendYourself = true;
        throw reason;
      });

    // TODO: its ugly, because he accesses data of other player.
    const addFriendToOriginUserPromise = this.firebaseGameService.observeLoggedInPlayerProfile().first().toPromise()
      .then(playerProfile => this.firebaseGameService.addCurrentUserAsFriendToOtherPlayer(uid, playerProfile.name))
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
