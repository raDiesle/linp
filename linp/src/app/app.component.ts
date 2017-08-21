import {ChangeDetectorRef, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  gamename: string;
  title = 'app';
  isMenuCollapsed = true;
  private authUser: firebase.User;

  constructor(private router: Router,
              private changeDetectorRef: ChangeDetectorRef,
              public afAuth: AngularFireAuth) {

    afAuth.authState.subscribe(authUser => {
      this.authUser = authUser;
    });
  }

  ngOnInit() {
    this.router.events.subscribe(s => {
      this.updateCurrentGameNameLinksForDevelopment(s);
    });
  }

  private updateCurrentGameNameLinksForDevelopment(s) {
    if (s instanceof NavigationEnd) {
      const fullUrl = s.urlAfterRedirects;
      if (fullUrl.split('/').length >= 3) {
        this.gamename = fullUrl.split('/')[2];
        this.changeDetectorRef.markForCheck();
      }
    }
  }
}
