import { FirebaseGameService } from './services/firebasegame.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth/auth';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { SvgIconRegistryService } from 'angular-svg-icon';

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

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private ngUnsubscribeNewGameChosen: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    public afAuth: AngularFireAuth,
    public db: AngularFirestore,
    private firebaseGameService: FirebaseGameService,
    private iconReg: SvgIconRegistryService
  ) {
  }

  ngOnInit() {
    // deprecated use firebaseGameService
    this.afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {

        // TODO
        // this.firebaseGameService.updatePlayerProfileIsOnline(true);

        if (authUser !== null && authUser !== undefined) {
          this.firebaseGameService.registerUpdateGamePlayerOnlineTrigger(authUser.uid);
        }
      });

    this.router.events
      .takeUntil(this.ngUnsubscribe)
      .subscribe(routerInformation => {
        this.updateCurrentGameName(routerInformation);
      });

    this.preloadSvg();
  }

  private preloadSvg() {
    /* tslint:disable */
    this.iconReg.addSvg('person_add',
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      < path d = "M0 0h24v24H0z" fill = "none" />
      <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>`
    );

    this.iconReg.addSvg('person_outline',
    `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M12 5.9c1.16 0 2.1.94 2.1 2.1s-.94 2.1-2.1 2.1S9.9 9.16 9.9 8s.94-2.1 2.1-2.1m0 9c2.97 0 6.1 1.46 6.1 2.1v1.1H5.9V17c0-.64 3.13-2.1 6.1-2.1M12 4C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 9c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
</svg>`);


    this.iconReg.addSvg('group_add',
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M8 10H5V7H3v3H0v2h3v3h2v-3h3v-2zm10 1c1.66 0 2.99-1.34 2.99-3S19.66 5 18 5c-.32 0-.63.05-.91.14.57.81.9 1.79.9 2.86s-.34 2.04-.9 2.86c.28.09.59.14.91.14zm-5 0c1.66 0 2.99-1.34 2.99-3S14.66 5 13 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm6.62 2.16c.83.73 1.38 1.66 1.38 2.84v2h3v-2c0-1.54-2.37-2.49-4.38-2.84zM13 13c-2 0-6 1-6 3v2h12v-2c0-2-4-3-6-3z"
                />
              </svg>`);
    this.iconReg.addSvg('person_add_disabled',
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="none" d="M0 0h24v24H0V0z"/>
    <circle cx="15" cy="8" r="4"/>
    <path d="M23 20v-2c0-2.3-4.1-3.7-6.9-3.9l6 5.9h.9zm-11.6-5.5C9.2 15.1 7 16.3 7 18v2h9.9l4 4 1.3-1.3-21-20.9L0 3.1l4 4V10H1v2h3v3h2v-3h2.9l2.5 2.5zM6 10v-.9l.9.9H6z"/>
</svg>
`);
    this.iconReg.addSvg('sync',
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path d="M12 4V1L8 5l4 4V6c3.31 0 6 2.69 6 6 0 1.01-.25 1.97-.7 2.8l1.46 1.46C19.54 15.03 20 13.57 20 12c0-4.42-3.58-8-8-8zm0 14c-3.31 0-6-2.69-6-6 0-1.01.25-1.97.7-2.8L5.24 7.74C4.46 8.97 4 10.43 4 12c0 4.42 3.58 8 8 8v3l4-4-4-4v3z"/>
            <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
        `);

        this.iconReg.addSvg('supervisor_account',
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M16.5 12c1.38 0 2.49-1.12 2.49-2.5S17.88 7 16.5 7C15.12 7 14 8.12 14 9.5s1.12 2.5 2.5 2.5zM9 11c1.66 0 2.99-1.34 2.99-3S10.66 5 9 5C7.34 5 6 6.34 6 8s1.34 3 3 3zm7.5 3c-1.83 0-5.5.92-5.5 2.75V19h11v-2.25c0-1.83-3.67-2.75-5.5-2.75zM9 13c-2.33 0-7 1.17-7 3.5V19h7v-2.25c0-.85.33-2.34 2.37-3.47C10.5 13.1 9.66 13 9 13z"/>
</svg>`);

this.iconReg.addSvg('vpn_key',
`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
</svg>`);


    /* tslint:enable */
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
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
        this.ngUnsubscribeNewGameChosen.next();
        this.ngUnsubscribeNewGameChosen.complete();
      }
    }
  }
}
