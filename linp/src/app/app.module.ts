import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AngularFireDatabaseModule} from 'angularfire2/database';
import {AngularFireModule} from 'angularfire2';
import {AngularFireAuthModule} from 'angularfire2/auth';

import {environment} from '../environments/environment';
import {AppComponent} from './app.component';

import {WelcomeComponent} from './welcome/welcome.component';
import {StartgameComponent} from './startgame/startgame.component';
import {FirsttipComponent} from './tip/firsttip/firsttip.component';
import {FirstguessComponent} from './guess/firstguess/firstguess.component';
import {SearchFilterPipe} from './startgame/gamelistsearch.pipe';
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
import {CalculatescoreService} from "./evaluation/calculatescore.service";


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    StartgameComponent,
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
    SimulationComponent

  ],
  imports: [
    RouterModule.forRoot([
      {
        path: 'welcome',
        component: WelcomeComponent
      },
      {
        path: 'startgame',
        component: StartgameComponent
      },
      {
        path: 'gamelobby/:gamename',
        component: GamelobbyComponent
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
        path: 'simulation',
        component: SimulationComponent
      },
      {
        path: '',
        redirectTo: '/welcome',
        pathMatch: 'full'
      },
    ]),
    FormsModule,
    NgbModule.forRoot(),
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  providers: [GuessService, CalculatescoreService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
