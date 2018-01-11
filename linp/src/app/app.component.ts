import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, NavigationEnd, NavigationStart, ParamMap, Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {Subject} from 'rxjs/Subject';
import {AngularFirestore} from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import {GamePlayer} from './models/game';

// http://jasonwatmore.com/post/2017/04/19/angular-2-4-router-animation-tutorial-example

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  styles: [`[hidden]:not([broken]) {
    display: none !important;
  }`],
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
              public db: AngularFirestore) {
  }

  ngOnInit() {
    this.afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
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

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
