import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule}   from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AlertModule } from 'ngx-bootstrap';
import { PaginationModule } from 'ngx-bootstrap/pagination';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


import { environment } from '../environments/environment';
import { AppComponent } from './app.component';

import { WelcomeComponent } from './welcome/welcome.component';
import { StartgameComponent} from './startgame/startgame.component';
import { FirsttipComponent } from './firsttip/firsttip.component';
import { FirstguessComponent } from './firstguess/firstguess.component';
import { SecondtipComponent } from './secondtip/secondtip.component';
import {SearchFilterPipe} from "./startgame/gamelistsearch.pipe";
import { GamelobbyComponent } from './gamelobby/gamelobby.component';
import { SinglewordonlyvalidatorDirective } from './firsttip/singlewordonlyvalidator.directive';
import { FadeComponent } from './widgets/fade/fade.component';



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
  FadeComponent

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
      path: 'secondtip',
      component: SecondtipComponent
    },
    {
      path: '',
      redirectTo: '/welcome',
      pathMatch: 'full'
    },
    ]),
  FormsModule,
  PaginationModule.forRoot(),
  AlertModule.forRoot(),
  BrowserModule,
  BrowserAnimationsModule,
  AngularFireModule.initializeApp(environment.firebase),
  AngularFireDatabaseModule, // imports firebase/database, only needed for database features
  AngularFireAuthModule
],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
