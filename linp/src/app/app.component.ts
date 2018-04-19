import { FirebaseGameService } from './services/firebasegame.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, NavigationStart, ParamMap, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { GamePlayer } from './models/game';

// http://jasonwatmore.com/post/2017/04/19/angular-2-4-router-animation-tutorial-example

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class AppComponent implements OnInit, OnDestroy {
  gameName: string;
  title = 'app';
  isMenuCollapsed = true;
  authUser: firebase.User;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private ngUnsubscribeNewGameChosen: Subject<void> = new Subject<void>();
  private isUserAuthOfflane = false;

  constructor(private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private firebaseGameService: FirebaseGameService
  ) {
  }

  ngOnInit() {
    // deprecated use firebaseGameService
    this.afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        console.log('auth updated');
        // TODO
        // this.firebaseGameService.updatePlayerProfileIsOnline(true);

        if (this.authUser !== null && this.firebaseGameService.isLoggedIn()) {
          this.authUser = authUser;
          this.updateGamePlayerOnline();
        }
      });

    this.router.events
      .takeUntil(this.ngUnsubscribe)
      .subscribe(routerInformation => {
        this.updateCurrentGameName(routerInformation);
      });
  }

  private updateCurrentGameName(routerInformation) {
    if (routerInformation instanceof NavigationEnd) {
      const fullUrl = routerInformation.urlAfterRedirects;
      if (fullUrl.split('/').length >= 3) {
        // TODO check if one of game routes
        const urlRequestedGameName = fullUrl.split('/')[2];
        const isNoChangeOfGame = urlRequestedGameName === this.gameName;
        if (isNoChangeOfGame) {
          return;
        }
        this.gameName = urlRequestedGameName;
        this.changeDetectorRef.markForCheck();
        console.log('changed game');
        this.ngUnsubscribeNewGameChosen.next();
        this.ngUnsubscribeNewGameChosen.complete();
      }
    }
  }

  private observeGamePlayerStatus(gamePlayers: { [uid: string]: GamePlayer }) {
    const nextPositiveRoute = 'firsttip';
    let prevStatus = null;
    Observable.pairs(gamePlayers)
      .flatMap(p => Observable.of(p))
      .every(playerObj => {
        const status = playerObj[1]['status'];
        const isAllSame = status === prevStatus || prevStatus === null;
        prevStatus = status;
        return isAllSame;
      })
      .subscribe(allGivenFirstSynonym => {
        // change
        const doNothing = null;
        if (allGivenFirstSynonym) {
          console.log('allHaveSameStatus');
          // this.router.navigate([nextPositiveRoute, this.gameName])
        }
      }
      );
  }

  private updateGamePlayerOnline() {
    // Fetch the current user's ID from Firebase Authentication.
    const uid = this.firebaseGameService.getAuthUid();

    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    const userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
    const userStatusFirestoreRef = firebase.firestore().doc('/status/' + uid);
    // We'll create two constants which we will write to
    // the Realtime database when this device is offline
    // or online.
    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    const isOnlineForDatabase = {
      state: 'online',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    // Firestore uses a different server timestamp value, so we'll
    // create two more constants for Firestore state.
    const isOfflineForFirestore = {
      state: 'offline',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const isOnlineForFirestore = {
      state: 'online',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };

    firebase.database().ref('.info/connected').on('value', function (snapshot) {
      if (snapshot.val() === false) {
        // Instead of simply returning, we'll also set Firestore's state
        // to 'offline'. This ensures that our Firestore cache is aware
        // of the switch to 'offline.'
        userStatusFirestoreRef.set(isOfflineForFirestore);
        return;
      };

      userStatusDatabaseRef.onDisconnect().set(isOfflineForDatabase).then(function () {
        userStatusDatabaseRef.set(isOnlineForDatabase);

        // We'll also add Firestore set here for when we come online.
        userStatusFirestoreRef.set(isOnlineForFirestore);
      });
    });

  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
