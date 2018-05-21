import { Component, OnInit, OnDestroy } from '@angular/core';
import { FirebaseGameService } from '../../services/firebasegame.service';
import { PlayerProfile } from '../../models/player';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { UserprofileService } from '../userprofile.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { GameStatus } from '../../models/game';

@Component({
  selector: 'app-loggedinactions',
  templateUrl: './loggedinactions.component.html',
  styleUrls: ['./loggedinactions.component.scss']
})
export class LoggedinactionsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public firstTimeLoggedInEver = false;
  public playerProfile: PlayerProfile;

  constructor(public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private userprofileService: UserprofileService,
    public firebaseGameService: FirebaseGameService,
    private router: Router,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    const prevPage = this.route.snapshot.paramMap.get('signInSuccessUrl');
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

  goToCreateAccountPage() {
    this.router.navigate(['createaccount']);
  }

  // @deprecated
  loginAnonymous(): void {
    this.afAuth.auth.signInAnonymously();
  }

  logout() {
    this.firebaseGameService.setAuthUserOffline()
      .then(() => this.afAuth.auth.signOut());
  }

  public openUserProfile() {
    this.router.navigate(['playerprofile' as GameStatus]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
