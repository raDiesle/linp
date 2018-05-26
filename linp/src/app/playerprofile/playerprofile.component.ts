import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth';
import {Subject} from 'rxjs/Subject';
import * as firebase from 'firebase/app';
import {AngularFirestore} from 'angularfire2/firestore';
import {PlayerProfile} from '../models/player';

@Component({
  selector: 'app-playerprofile',
  templateUrl: './playerprofile.component.html',
  styleUrls: ['./playerprofile.component.css']
})
export class PlayerprofileComponent implements OnInit {
  callbackUrl = '/welcome';
  isToGenerateFirstTimeProfile: boolean;
  public playerName: string = undefined;
  public successfulSavedPlayername = false;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private authUser: firebase.User;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    // why it is not possible to read synchronously with snapshot?
    this.route.queryParamMap.subscribe(params => {
      this.callbackUrl = params.get('callbackUrl') || this.callbackUrl;
    });

    this.afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
        this.loadPlayerProfile(authUser.uid);
      });
  }

  updateOrCreateAccountAction() {
    this.successfulSavedPlayername = true;
    const playerPath = '/players/' + this.authUser.uid;
    const newPlayerProfile: PlayerProfile = {
      uid: this.authUser.uid,
      name: this.playerName,
      uistates: {
        showHelpPopover: true,
        showShortDescription: true
      }
    };

    const doc = this.db.doc<PlayerProfile>(playerPath);
    if (this.isToGenerateFirstTimeProfile) {
      doc
        .set(newPlayerProfile)
        .then(() => {
          this.router.navigate([this.callbackUrl]);
        });
    } else {
      doc
        .update(newPlayerProfile)
        .then(() => {
          this.router.navigate([this.callbackUrl]);
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
