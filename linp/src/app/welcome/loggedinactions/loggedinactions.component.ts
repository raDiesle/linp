import {Component, OnDestroy, OnInit} from '@angular/core';
import {FirebaseGameService} from '../../services/firebasegame.service';
import {PlayerProfile} from '../../models/player';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore} from 'angularfire2/firestore';

import {Router} from '@angular/router';
import {Subject} from 'rxjs/Subject';
import {GameStatus} from '../../models/game';

@Component({
  selector: 'app-loggedinactions',
  templateUrl: './loggedinactions.component.html',
  styleUrls: ['./loggedinactions.component.scss']
})
export class LoggedinactionsComponent implements OnInit, OnDestroy {

  public firstTimeLoggedInEver = false;
  public playerProfile: PlayerProfile;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFirestore,
              public firebaseGameService: FirebaseGameService,
              private router: Router) {

  }

  ngOnInit() {
    // const prevPage = this.route.snapshot.paramMap.get('signInSuccessUrl');
// TODO
    this.afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {

        if (!authUser) {
          return;
        }

        // TODO move to init
        this.firebaseGameService.observeLoggedInPlayerProfile()
          .takeUntil(this.ngUnsubscribe)
          .subscribe(playerProfile => {
            this.playerProfile = playerProfile;

            this.firstTimeLoggedInEver = playerProfile === null;
            // executed only when needed
            if (this.firstTimeLoggedInEver || playerProfile.name === undefined) {
              this.openUserProfile();
            }
          });
      });
  }

  logout() {
    this.firebaseGameService.setAuthUserOffline()
      .then(() => this.afAuth.auth.signOut());
  }

  public openUserProfile() {
    this.router.navigate(['playerprofile' as GameStatus], {skipLocationChange: true});
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
