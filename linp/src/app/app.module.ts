import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AlertModule } from 'ngx-bootstrap';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { StartgameComponent } from './startgame/startgame.component';
import { FirsttipComponent } from './firsttip/firsttip.component';
import { FirstguessComponent } from './firstguess/firstguess.component';
import { SecondtipComponent } from './secondtip/secondtip.component';



@NgModule({
   declarations: [
  AppComponent,
  WelcomeComponent,
  StartgameComponent,
  FirsttipComponent,
  FirstguessComponent,
  SecondtipComponent
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
      path: 'firstip',
      component: FirsttipComponent
    },
    {
      path: 'firstguess',
      component: FirstguessComponent
    },
    {
      path: 'secondtip',
      component: SecondtipComponent
    },
    {
      path: '',
      redirectTo: '/welcome',
      pathMatch: 'full'
    },
    ]),
  AlertModule.forRoot(),
  BrowserModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFireDatabaseModule, // imports firebase/database, only needed for database features
  AngularFireAuthModule,
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
