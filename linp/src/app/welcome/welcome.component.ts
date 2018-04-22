import { ActivatedRoute } from '@angular/router';
import { Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import { AngularFirestore } from 'angularfire2/firestore';
import { PlayerProfile } from '../models/player';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { UserprofileService } from './userprofile.service';
import { LoginbyemailComponent } from './loginbyemail/loginbyemail.component';
import { Subject } from 'rxjs/Subject';
import { fadeInAnimation } from '../widgets/animations';
import { Router } from '@angular/router';
import { GameStatus } from '../models/game';
import { FirebaseGameService } from '../services/firebasegame.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
})
export class WelcomeComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;
  @HostBinding('style.display') display = 'block';

  firstTimeLoggedInEver = false;
  isExpandInstructions = false;

  playerProfile: PlayerProfile;
  authUser: firebase.User;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private userprofileService: UserprofileService,
    public firebaseGameService: FirebaseGameService,
    private modalService: NgbModal,
    private router: Router,
    private route: ActivatedRoute
  ) {

    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;

        if (!this.authUser) {
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

  ngOnInit() {
    const prevPage = this.route.snapshot.paramMap.get('signInSuccessUrl');
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
