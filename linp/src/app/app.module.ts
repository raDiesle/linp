import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AngularFirestoreModule} from 'angularfire2/firestore';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireStorageModule} from 'angularfire2/storage';

import {environment} from '../environments/environment';
import {AppComponent} from './app.component';

import {WelcomeComponent} from './welcome/welcome.component';
import {JoinGameComponent} from './joingame/joingame.component';
import {FirsttipComponent} from './tip/firsttip/firsttip.component';
import {FirstguessComponent} from './guess/firstguess/firstguess.component';
import {SearchFilterPipe} from './joingame/gamelistsearch.pipe';
import {GamelobbyComponent} from './gamelobby/gamelobby.component';
import {SinglewordonlyvalidatorDirective} from './widgets/singlewordonly_depre/singlewordonlyvalidator.directive';
import {FadeComponent} from './widgets/fade/fade.component';
import {WaitingdotsComponent} from './widgets/waitingdots/waitingdots.component';
import {WordsdrumrollComponent} from './widgets/wordsdrumroll/wordsdrumroll.component';
import {GuessService} from './guess/guess.service';
import {SecondtipComponent} from './tip/secondtip/secondtip.component';
import {SecondguessComponent} from './guess/secondguess/secondguess.component';
import {EvaluationComponent} from './evaluation/evaluation.component';
import {SimulationComponent} from './simulation/simulation.component';
import {UserprofileService} from './welcome/userprofile.service';
import {LoginbyemailComponent} from './welcome/loginbyemail/loginbyemail.component';
import {HttpClientModule} from '@angular/common/http';
import {PlayerprofileComponent} from './playerprofile/playerprofile.component';
import {CreategameComponent} from './creategame/creategame.component';
import {GamerulesComponent} from './gamerules/gamerules.component';
import {ShareButtonsModule} from 'ngx-sharebuttons';
import {HttpModule} from '@angular/http';
import {PreparegameComponent} from './preparegame/preparegame.component';
import {BlinkComponent} from './widgets/blink/blink.component';
import {CreatewordComponent} from './createword/createword.component';
import {LinpCardsModelService} from './simulation/linpcardsinit.service';
import {CreateAccountComponent} from './create-account/create-account.component';
import {GamelobbyService} from './gamelobby/gamelobby-service';
import {PreparegameService} from './preparegame/preparegame.service';
import {FirsttipService} from './tip/firsttip/firsttip.service';
import {TimeAgoPipe} from 'time-ago-pipe';
import {FirebaseGameService} from './services/firebasegame.service';
import {AuthGuard} from './services/authguard';
import {FinalizeroundComponent} from './finalizeround/finalizeround.component';
import {OrderByPipe} from './finalizeround/order-by.pipe';

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
    LoginbyemailComponent,
    PlayerprofileComponent,
    CreategameComponent,
    GamerulesComponent,
    PreparegameComponent,
    BlinkComponent,
    CreatewordComponent,
    CreateAccountComponent,
    TimeAgoPipe,
    FinalizeroundComponent,
    OrderByPipe
  ],
  entryComponents: [
    LoginbyemailComponent
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
        component: FirsttipComponent
      },
      {
        path: 'firstguess/:gamename',
        component: FirstguessComponent
      },
      {
        path: 'secondtip/:gamename',
        component: SecondtipComponent
      },
      {
        path: 'secondguess/:gamename',
        component: SecondguessComponent
      },
      {
        path: 'evaluation/:gamename',
        component: EvaluationComponent
      },
      {
        path: 'finalizeround/:gamename',
        component: FinalizeroundComponent
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
        component: PlayerprofileComponent
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
        component: CreatewordComponent
      },
      {
        path: 'createaccount',
        component: CreateAccountComponent
      },
      {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
      },
    ]),
    FormsModule,
    NgbModule.forRoot(),
    ShareButtonsModule.forRoot(),
    BrowserModule,
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule
  ],
  providers: [AuthGuard, FirebaseGameService, GuessService, UserprofileService, GamelobbyComponent, GamelobbyService, PreparegameComponent, PreparegameService, FirsttipService, LinpCardsModelService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
