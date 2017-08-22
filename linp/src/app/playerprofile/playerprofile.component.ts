import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Subject} from 'rxjs/Subject';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from "angularfire2/database";

@Component({
  selector: 'app-playerprofile',
  templateUrl: './playerprofile.component.html',
  styleUrls: ['./playerprofile.component.css']
})
export class PlayerprofileComponent implements OnInit {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private authUser: firebase.User;
  private playerName: string = undefined;
  private successfulSavedPlayername = false;

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFireDatabase) {
    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
      });
  }

  ngOnInit() {
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
      });
  }

}
