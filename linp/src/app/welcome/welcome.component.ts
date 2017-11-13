import {Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {AngularFirestore} from 'angularfire2/firestore';
import {PlayerProfile} from '../models/player';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {UserprofileService} from './userprofile.service';
import {LoginbyemailComponent} from './loginbyemail/loginbyemail.component';
import {Subject} from 'rxjs/Subject';
import {fadeInAnimation} from '../widgets/animations';
import {Router} from "@angular/router";

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

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFirestore,
              private userprofileService: UserprofileService,
              private modalService: NgbModal,
              private router: Router) {

    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;

        if (!this.authUser) {
          return;
        }
        this.loadPlayerProfile(authUser);
      });
  }

  private loadPlayerProfile(responseData) {
    const uid = responseData.uid;
    this.db.doc<PlayerProfile>('/players/' + uid).valueChanges()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(playerProfile => {
        this.playerProfile = playerProfile;

        this.firstTimeLoggedInEver = playerProfile === null;
        // executed only when needed
        if (this.firstTimeLoggedInEver) {
          this.router.navigate(['/createaccount']);
        } else if (playerProfile.name === undefined) {//
          this.router.navigate(['/playerprofile']);
        }
      });
  }

  ngOnInit() {
  }

  loginByGoogle(): void {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginAnonymous(): void {
    this.afAuth.auth.signInAnonymously();
  }

  loginEmailPassword(content) {
    const modalRef = this.modalService.open(LoginbyemailComponent);
    // modalRef.componentInstance.name = 'World';
  }

  logout() {
    this.ngOnDestroy();
    this.afAuth.auth.signOut();
    window.location.reload();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
