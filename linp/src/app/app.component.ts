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
    this.firebaseGameService.observeAuthUser()
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

    this.iconReg.addSvg('spy_header',
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M4.749 35.632l3.125-6.125-6.211-4.636C2.597 23.499 6.9 18.5 20 18.5c13.161 0 17.418 4.995 18.34 6.369l-6.214 4.638 3.125 6.125L20 38.491 4.749 35.632z" fill="#98ccfd"/><path d="M20 19c11.846 0 16.326 4.125 17.64 5.767l-5.476 4.086-.676.505.383.751 2.63 5.154L20 37.983 5.498 35.264l2.63-5.154.383-.751-.676-.505-5.475-4.086C3.68 23.119 8.163 19 20 19m0-1C4.325 18 1 25 1 25l6.237 4.655L4 36l16 3 16-3-3.237-6.345L39 25s-3.325-7-19-7z" fill="#4788c7"/><path d="M20 38s-8-3.119-8-8v-9.326h16V30c0 4.931-8 8-8 8z" fill="#4788c7"/><path d="M28.4 23.9a3.104 3.104 0 0 1-3.101-3.1c0-1.709 1.391-3.1 3.101-3.1 2.572 0 3.1.759 3.1 1.9 0 1.878-1.503 4.3-3.1 4.3zm-16.8 0c-1.597 0-3.1-2.422-3.1-4.3 0-1.141.527-1.9 3.1-1.9a3.104 3.104 0 0 1 3.101 3.1 3.105 3.105 0 0 1-3.101 3.1z" fill="#b6dcfe"/><path d="M28.4 18.2c2.6 0 2.6.776 2.6 1.4 0 1.589-1.31 3.8-2.6 3.8-1.434 0-2.6-1.166-2.6-2.6s1.166-2.6 2.6-2.6m-16.8 0c1.434 0 2.6 1.166 2.6 2.6s-1.166 2.6-2.6 2.6c-1.29 0-2.6-2.211-2.6-3.8 0-.624 0-1.4 2.6-1.4m16.8-1a3.6 3.6 0 0 0 0 7.2c1.988 0 3.6-2.812 3.6-4.8s-1.612-2.4-3.6-2.4zm-16.8 0c-1.988 0-3.6.412-3.6 2.4s1.612 4.8 3.6 4.8a3.6 3.6 0 0 0 0-7.2z" fill="#4788c7"/><path d="M20 34.5a3.477 3.477 0 0 1-2.705-1.309l-.094-.115-.141-.046A9.474 9.474 0 0 1 10.5 24v-6.017a4.27 4.27 0 0 1 4.266-4.266h10.469a4.27 4.27 0 0 1 4.266 4.266V24a9.476 9.476 0 0 1-6.561 9.031l-.141.046-.094.115A3.479 3.479 0 0 1 20 34.5z" fill="#fff"/><path d="M25.234 14.217A3.77 3.77 0 0 1 29 17.983V24a8.975 8.975 0 0 1-6.215 8.555l-.281.091-.186.23C21.738 33.59 20.894 34 20 34s-1.738-.41-2.318-1.124l-.186-.23-.281-.091A8.975 8.975 0 0 1 11 24v-6.017a3.77 3.77 0 0 1 3.766-3.766h10.468m0-1H14.766A4.766 4.766 0 0 0 10 17.983V24c0 4.442 2.899 8.203 6.906 9.506C17.639 34.41 18.745 35 20 35s2.361-.59 3.094-1.494C27.101 32.203 30 28.442 30 24v-6.017a4.766 4.766 0 0 0-4.766-4.766z" fill="#4788c7"/><path d="M17.286 21.583s1.1-.905 2.714-.905 2.714.905 2.714.905" fill="none" stroke="#4788c7" stroke-miterlimit="10"/><path d="M28.25 19h-6a1 1 0 0 0-1 1v2a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3v-3z" fill="#4788c7"/><g><path d="M17.75 19h-6v3a3 3 0 0 0 3 3h1a3 3 0 0 0 3-3v-2a1 1 0 0 0-1-1z" fill="#4788c7"/></g><g><path d="M20 20.504C8.931 20.504 1.495 17.658 1.495 15S8.931 9.496 20 9.496 38.505 12.342 38.505 15 31.069 20.504 20 20.504z" fill="#98ccfd"/><path d="M20 9.991c11.158 0 18.009 2.917 18.009 5.009 0 2.092-6.851 5.009-18.009 5.009S1.991 17.092 1.991 15c0-2.092 6.851-5.009 18.009-5.009M20 9C9.507 9 1 11.686 1 15s8.507 6 19 6 19-2.686 19-6-8.507-6-19-6z" fill="#4788c7"/></g><g><path d="M20 16.501c-2.583 0-10.413 0-10.5-3.064 1.003-4.493 2.68-11.938 5.825-11.938.875 0 1.502.228 2.167.47.717.261 1.458.53 2.508.53 1.066 0 1.844-.276 2.595-.543.663-.235 1.289-.457 2.08-.457 2.782 0 4.159 5.407 5.49 10.637l.335 1.308c-.09 3.057-7.113 3.057-10.5 3.057z" fill="#98ccfd"/><path d="M24.675 1.998c2.395 0 3.783 5.452 5.007 10.262.105.413.21.825.316 1.235-.201 2.508-7.301 2.508-9.998 2.508-8.052 0-9.907-1.35-9.999-2.524.913-4.083 2.593-11.481 5.324-11.481.787 0 1.347.204 1.997.44.722.263 1.54.56 2.678.56 1.152 0 2.007-.304 2.762-.571.648-.231 1.208-.429 1.913-.429m0-.998C22.888 1 21.925 2 20 2s-2.75-1-4.675-1C11.888 1 10.237 7.846 9 13.385 9 16.769 15.899 17 20 17s11-.077 11-3.615C29.487 7.538 28.112 1 24.675 1z" fill="#4788c7"/></g></svg>`);

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

    this.iconReg.addSvg('thumb_down',
      `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
<g>
	<g>
		<rect fill="none" width="24" height="24"/>
	</g>
	<path d="M15,3H6C5.17,3,4.46,3.5,4.16,4.22l-3.02,7.05C1.05,11.5,1,11.74,1,12l0,2c0,1.1,0.9,2,2,2h6.31l-0.95,4.57l-0.03,0.32
		c0,0.41,0.17,0.79,0.44,1.06L9.83,23l6.59-6.59C16.78,16.05,17,15.55,17,15V5C17,3.9,16.1,3,15,3z M19,3v12h4V3H19z"/>
</g>
</svg>`);
    this.iconReg.addSvg('thumb_up',
      `<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
<path fill="none" d="M0,0h24v24H0V0z"/>
<path d="M1,21h4V9H1V21z M23,10c0-1.1-0.9-2-2-2h-6.31l0.95-4.57l0.03-0.32c0-0.41-0.17-0.79-0.44-1.06L14.17,1L7.59,7.59
	C7.22,7.95,7,8.45,7,9v10c0,1.1,0.9,2,2,2h9c0.83,0,1.54-0.5,1.84-1.22l3.02-7.05C22.95,12.5,23,12.26,23,12V10z"/>
</svg>`);

    this.iconReg.addSvg('send',
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
</svg>`);

this.iconReg.addSvg('bar_chart',
`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
<path d="M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"/>
<path fill="none" d="M0 0h24v24H0z"/>
</svg>
`);

this.iconReg.addSvg('home',
`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
</svg>`);

this.iconReg.addSvg('history',
`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
</svg>`);

this.iconReg.addSvg('chat_button_outline',
`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path fill="none" d="M0 0h24v24H0V0z"/>
    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
</svg>`);

this.iconReg.addSvg('chevron_right',
`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
</svg>`);

this.iconReg.addSvg('chevron_left',
`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
</svg>`);

this.iconReg.addSvg('last_page',
`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"/>
    <path fill="none" d="M0 0h24v24H0V0z"/>
</svg>`);



    /* tslint:enable */
  }

  // Deprecated, might be broken
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
        this.gameName = decodeURI(urlRequestedGameName);
        this.changeDetectorRef.markForCheck();
        this.ngUnsubscribeNewGameChosen.next();
        this.ngUnsubscribeNewGameChosen.complete();
      }
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
