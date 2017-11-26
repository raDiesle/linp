import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Subject} from 'rxjs/Subject';
import * as firebase from 'firebase/app';
import {AngularFirestore} from "angularfire2/firestore";
import {PlayerProfile} from "../models/player";
import {Router} from "@angular/router";

@Component({
  selector: 'app-playerprofile',
  templateUrl: './playerprofile.component.html',
  styleUrls: ['./playerprofile.component.css']
})
export class PlayerprofileComponent implements OnInit {
  isToGenerateFirstTimeProfile: boolean;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private authUser: firebase.User;
  private playerName: string = undefined;
  private successfulSavedPlayername = false;

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFirestore,
              private router: Router) {
    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;

        this.loadPlayerProfile(authUser.uid);
      });
  }

  ngOnInit() {
  }

  updateOrCreateAccountAction() {
    this.successfulSavedPlayername = true;
    const playerPath = '/players/' + this.authUser.uid;
    const newPlayerProfile = {
      uid: this.authUser.uid,
      name: this.playerName
    };

    const doc = this.db.doc<PlayerProfile>(playerPath);
    if (this.isToGenerateFirstTimeProfile) {
      doc
        .set(newPlayerProfile)
        .then(a => {
          this.router.navigate(['/welcome']);
        });
    } else {
      doc
        .update(newPlayerProfile)
        .then(a => {
          this.router.navigate(['/welcome']);
        });
    }
  }

  private loadPlayerProfile(uid: string) {
    this.db.doc<PlayerProfile>('/players/' + uid)
      .valueChanges()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(playerProfile => {
        this.isToGenerateFirstTimeProfile = !playerProfile;
        this.playerName = this.isToGenerateFirstTimeProfile ? '' : playerProfile.name;
      });
  }

}
