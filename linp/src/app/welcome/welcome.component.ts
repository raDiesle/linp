import {Component, HostBinding, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {PlayerProfile} from '../models/player';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {UserprofileService} from './userprofile.service';
import {LoginbyemailComponent} from './loginbyemail/loginbyemail.component';
import {Subject} from 'rxjs/Subject';
import {fadeInAnimation} from '../widgets/animations';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  animations: [fadeInAnimation],
  // attach the fade in animation to the host (root) element of this component
})
export class WelcomeComponent implements OnInit, OnDestroy {
  @HostBinding('@fadeInAnimation') fadeInAnimation = true;
  @HostBinding('style.display')   display = 'block';

  firstTimeLoggedInEver = false;
  successfulSavedPlayername = false;
  isExpandInstructions = false;

  playerProfile: PlayerProfile;
  playerName = '';
  isPlayerNameLoaded = false;
  authUser: firebase.User;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFireDatabase,
              private userprofileService: UserprofileService,
              private modalService: NgbModal) {

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
    this.db.object('/players/' + uid)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(playerProfile => {
        this.playerProfile = playerProfile;

        this.firstTimeLoggedInEver = playerProfile.$value === null;
        // executed only when needed
        const suggestedPlayerName = this.userprofileService.extractFirstName(this.authUser.displayName);

        this.playerName = !this.firstTimeLoggedInEver ? this.playerProfile.name : suggestedPlayerName;
        this.isPlayerNameLoaded = this.playerName !== '';
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
    this.afAuth.auth.signOut();
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
