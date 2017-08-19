import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {PlayerProfile} from '../models/player';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {UserprofileService} from './userprofile.service';
import {LoginbyemailComponent} from './loginbyemail/loginbyemail.component';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit, OnDestroy {

  firstTimeLoggedInEver = false;
  successfulSavedPlayername = false;
  isExpandInstructions = false;

  playerProfile: PlayerProfile;
  playerName = '';
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

  logout() {
    this.afAuth.auth.signOut();
  }

  savePlayerName() {
    const playerPath = '/players/' + this.authUser.uid;
    const newPlayerProfile = {
      uid: this.authUser.uid,
      name: this.playerName
    };
    this.db.object(playerPath)
      .update(newPlayerProfile)
      .then(a => {
        this.successfulSavedPlayername = true;
        setTimeout(() => this.successfulSavedPlayername = false, 1500);
      });
  }

  loginEmailPassword(content) {
    const modalRef = this.modalService.open(LoginbyemailComponent);
    // modalRef.componentInstance.name = 'World';
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
