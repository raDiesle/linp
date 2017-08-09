import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {PlayerProfile} from '../models/player';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  firstTimeLoggedInEver: boolean = false;
  successfulSavedPlayername : boolean = false;

  playerProfile: PlayerProfile;



  user: firebase.User;
  playerName: string = '';

  isExpandInstructions : boolean = false;

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFireDatabase) {

    afAuth.authState.subscribe(responseData => {
      this.user = responseData;

      // extract to top level
      const notLoggedIn = !this.user;
      if(notLoggedIn){
        return;
      }

      const uid = responseData.uid;
      this.db.object('/players/' + uid).subscribe(playerResponse => {
        this.playerProfile = playerResponse;

        this.firstTimeLoggedInEver = playerResponse.$value === null;

        if(this.firstTimeLoggedInEver){
          this.playerName = this.extractFirstName(this.user.displayName);

        }else{
          this.playerName = this.playerProfile.name;
        }
      });

      this.extractFirstName(responseData.displayName);
    });
  }

  ngOnInit() {
  }

  login(): void {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  loginAnonymous(): void {
    this.afAuth.auth.signInAnonymously();
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  savePlayerName(){
      const playerPath = '/players/' + this.user.uid;
      const newPlayerProfile = {
        uid : this.user.uid,
        name : this.playerName
      };
      this.db.database
        .ref(playerPath)
        .update(newPlayerProfile)
        .then(a => {
          this.successfulSavedPlayername = true;
          setTimeout(()=>this.successfulSavedPlayername = false, 1500);
      });
  }

  extractFirstName(displayName: string): string {
    // TODO use inside of html only
    displayName = displayName ? displayName : 'Bugs Bunny';

    const firstLastName = displayName.split(' ');
    // TODO use inside of html only
    if (firstLastName.length > 0) {
      const firstName = firstLastName[0];
      return firstName;
    } else {
      return displayName;
    }
  }
}
