import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {PlayerProfile} from '../models/player';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  firstTimeLoggedInEver = false;
  successfulSavedPlayername = false;
  isExpandInstructions = false;

  playerProfile: PlayerProfile;
  playerName = '';
  authUser: firebase.User;

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFireDatabase,
              private modalService: NgbModal) {

    afAuth.authState
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
      .subscribe(playerProfile => {
        this.playerProfile = playerProfile;

        this.firstTimeLoggedInEver = playerProfile.$value === null;
        this.playerName = !this.firstTimeLoggedInEver ? this.playerProfile.name : this.extractFirstName(this.authUser.displayName);
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

  extractFirstName(displayName: string): string {
    // TODO use inside of html only TODO use random marvel name
    const randomSuggestedName = 'Bugs_Bunny';
    displayName = displayName ? displayName : randomSuggestedName;

    const firstLastName = displayName.split(' ');
    // TODO use inside of html only
    return (firstLastName.length > 0) ? firstLastName[0] : displayName;
  }

  loginEmailPassword(content) {
    this.modalService.open(content).result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(reason);
      // console.log(`Dismissed ${this.getDismissReason(reason)}`);
    });
  }
}
