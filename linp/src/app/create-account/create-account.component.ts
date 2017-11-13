import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {AngularFirestore} from 'angularfire2/firestore';
import {Subject} from 'rxjs/Subject';
import * as firebase from 'firebase';
import {PlayerProfile} from '../models/player';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CreateAccountComponent implements OnInit {

  public playerEmail: string = undefined;
  public playerPassword: string = undefined;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFirestore,
              private router: Router) {
  }

  ngOnInit() {

  }

  createAccount(): void {
    this.createAuthenticationUserAndUserProfile();
  }

  private createAuthenticationUserAndUserProfile() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.playerEmail, this.playerPassword)
      .then(user => {
        this.createGameProfile(user.uid);
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/weak-password') {
          alert('The password is too weak.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
      })
    ;
  }

  private createGameProfile(uid: string) {
    const newPlayerProfile: PlayerProfile = {
      uid: uid
    };
    const playerPath = '/players/' + uid;
    this.db.doc<PlayerProfile>(playerPath)
      .set(newPlayerProfile)
      .then(a => {
        alert('Successful created');
        this.router.navigate(['/playerprofile']);
      });
  }
}
