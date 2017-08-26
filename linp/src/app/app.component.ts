import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {fadeInAnimation} from "app/widgets/animations";
import {Subject} from "rxjs/Subject";
import {AngularFireDatabase} from "angularfire2/database";

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
  private isUserAuthOfflane = false;

  constructor(private router: Router,
              private changeDetectorRef: ChangeDetectorRef,
              public afAuth: AngularFireAuth,
              public db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
      });

    firebase.database().ref('.info/connected')
      .on('value', (snap) => {
        this.isUserAuthOfflane = !!this.authUser && !snap.val();
      });

    // dev only
    this.router.events
      .takeUntil(this.ngUnsubscribe)
      .subscribe(routerInformation => {
        this.updateCurrentGameNameLinksForDevelopment(routerInformation);
      });
  }

  private updateCurrentGameNameLinksForDevelopment(routerInformation) {
    if (routerInformation instanceof NavigationEnd) {
      const fullUrl = routerInformation.urlAfterRedirects;
      if (fullUrl.split('/').length >= 3) {
        this.gameName = fullUrl.split('/')[2];
        this.changeDetectorRef.markForCheck();
      }
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
