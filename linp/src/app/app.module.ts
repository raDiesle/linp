import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';

import {environment} from '../environments/environment';
import {AppComponent} from './app.component';

import {WelcomeComponent} from './welcome/welcome.component';
import {JoinGameComponent} from './joingame/joingame.component';
import {FirsttipComponent} from './tip/firsttip/firsttip.component';
import {FirstguessComponent} from './guess/firstguess/firstguess.component';
import {SearchFilterPipe} from './joingame/gamelistsearch.pipe';
import {GamelobbyComponent} from './gamelobby/gamelobby.component';
import {SinglewordonlyvalidatorDirective} from './tip/singlewordonly_depre/singlewordonlyvalidator.directive';
import {FadeComponent} from './widgets/fade/fade.component';
import {WaitingdotsComponent} from './widgets/waitingdots/waitingdots.component';
import {WordsdrumrollComponent} from './widgets/wordsdrumroll/wordsdrumroll.component';
import {GuessService} from './guess/guess.service';
import {SecondtipComponent} from './tip/secondtip/secondtip.component';
import {SecondguessComponent} from './guess/secondguess/secondguess.component';
import {EvaluationComponent} from './evaluation/evaluation.component';
import {SimulationComponent} from './simulation/simulation.component';
import {HttpClientModule} from '@angular/common/http';
import {PlayerprofileComponent} from './playerprofile/playerprofile.component';
import {CreategameComponent} from './creategame/creategame.component';
import {GamerulesComponent} from './gamerules/gamerules.component';

import {HttpModule} from '@angular/http';
import {PreparegameComponent} from './preparegame/preparegame.component';
import {BlinkComponent} from './widgets/blink/blink.component';
import {CreatewordComponent} from './createword/createword.component';
import {LinpCardsModelService} from './simulation/linpcardsinit.service';

import {TimeAgoPipe} from 'time-ago-pipe';
import {FirebaseGameService} from './services/firebasegame.service';
import {FinalizeroundComponent} from './finalizeround/finalizeround.component';
import {AuthGuard} from './services/auth.guard';
import {ShareModule} from '@ngx-share/core';
import {ShareButtonModule} from '@ngx-share/button';
import {ActivegamesComponent} from './welcome/activegames/activegames.component';
import {FriendlistComponent} from './welcome/friendlist/friendlist.component';

import {UiSwitchModule} from 'ngx-ui-switch';

import {AuthMethods, AuthProvider, CredentialHelper, FirebaseUIAuthConfig, FirebaseUIModule} from 'firebaseui-angular';
import {AddfriendComponent} from './addfriend/addfriend.component';
import {WindowRef} from './WindowRef';
import {IngameprogressrulesComponent} from './ingameprogressrules/ingameprogressrules.component';
import {HeaderComponent} from './header/header.component';
import {LoggedinactionsComponent} from './welcome/loggedinactions/loggedinactions.component';
import {MaintenanceComponent} from './welcome/maintenance/maintenance.component';
import {GameprogressComponent} from './widgets/gameprogress/gameprogress.component';
import {ScorecardComponent} from './evaluation/scorecard/scorecard.component';
import {NextbuttonComponent} from './evaluation/nextbutton/nextbutton.component';
import {ActionguideService} from './services/actionguide.service';
import {ActionguidemodalComponent} from './widgets/actionguidemodal/actionguidemodal.component';
import {CustomErrorHandler} from './services/customerrorhandler';
import {BasicrulesComponent} from './gamerules/basicrules/basicrules.component';
import {GamelobbyrulesComponent} from './gamerules/gamelobbyrules/gamelobbyrules.component';
import {FirsttiprulesComponent} from './gamerules/firsttiprules/firsttiprules.component';
import {EvaluationrulesComponent} from './gamerules/evaluationrules/evaluationrules.component';
import {FirstguessrulesComponent} from './gamerules/firstguessrules/firstguessrules.component';
import {SecondtiprulesComponent} from './gamerules/secondtiprules/secondtiprules.component';
import {SecondguessrulesComponent} from './gamerules/secondguessrules/secondguessrules.component';
import {ShortdescriptionComponent} from './welcome/shortdescription/shortdescription.component';
import {GameslistComponent} from './joingame/gameslist/gameslist.component';

export function windowFactory() {
  return window;
}

const firebaseUiAuthConfig: FirebaseUIAuthConfig = {
  providers: [
    AuthProvider.Google,
    AuthProvider.Facebook,
    AuthProvider.Twitter,
    AuthProvider.Github,
    AuthProvider.Password
  ],
  // signInSuccessUrl: '/',
  method: AuthMethods.Popup,
//TODO  tos: '<your-tos-link>',
  credentialHelper: CredentialHelper.None
};

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    JoinGameComponent,
    FirsttipComponent,
    FirstguessComponent,
    SecondtipComponent,
    SearchFilterPipe,
    GamelobbyComponent,
    SinglewordonlyvalidatorDirective,
    FadeComponent,
    WaitingdotsComponent,
    WordsdrumrollComponent,
    SecondguessComponent,
    EvaluationComponent,
    SimulationComponent,
    ActivegamesComponent,
    PlayerprofileComponent,
    CreategameComponent,
    GamerulesComponent,
    PreparegameComponent,
    BlinkComponent,
    CreatewordComponent,
    TimeAgoPipe,
    FinalizeroundComponent,
    FriendlistComponent,
    AddfriendComponent,
    IngameprogressrulesComponent,
    HeaderComponent,
    LoggedinactionsComponent,
    MaintenanceComponent,
    GameprogressComponent,
    ScorecardComponent,
    NextbuttonComponent,
    ActionguidemodalComponent,
    BasicrulesComponent,
    GamelobbyrulesComponent,
    FirsttiprulesComponent,
    EvaluationrulesComponent,
    FirstguessrulesComponent,
    SecondtiprulesComponent,
    SecondguessrulesComponent,
    ShortdescriptionComponent,
    GameslistComponent
  ],
  entryComponents: [
    ActionguidemodalComponent,
    GamerulesComponent,
    ActivegamesComponent,
    FriendlistComponent
  ],
  imports: [
    RouterModule.forRoot([
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'joingame',
        component: JoinGameComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'addfriend/:uid',
        component: AddfriendComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'gamelobby/:gamename',
        component: GamelobbyComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'preparegame/:gamename',
        component: PreparegameComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'firsttip/:gamename',
        component: FirsttipComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'firstguess/:gamename',
        component: FirstguessComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'secondtip/:gamename',
        component: SecondtipComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'secondguess/:gamename',
        component: SecondguessComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'evaluation/:gamename',
        component: EvaluationComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'finalizeround/:gamename',
        component: FinalizeroundComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'simulation',
        component: SimulationComponent
      },
      {
        path: 'simulation/:gamename',
        component: SimulationComponent
      },
      {
        path: 'playerprofile',
        component: PlayerprofileComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'creategame',
        component: CreategameComponent,
        canActivate: [AuthGuard]
      },
      {
        path: 'gamerules',
        component: GamerulesComponent
      },
      {
        path: 'createword',
        component: CreatewordComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
      }
    ]),
    FormsModule,
    NgbModule.forRoot(),
    UiSwitchModule,
    ShareModule.forRoot(),
    ShareButtonModule.forRoot(),

    BrowserModule,
    HttpClientModule,
    HttpModule, // TODO still needed?
    BrowserAnimationsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,

    FirebaseUIModule.forRoot(firebaseUiAuthConfig),
  ],
  // missingTranslation: MissingTranslationStrategy.Error,
  providers: [AuthGuard, FirebaseGameService, GuessService, GamelobbyComponent,
    PreparegameComponent, LinpCardsModelService, ActionguideService, WindowRef,
    {provide: ErrorHandler, useClass: CustomErrorHandler}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
