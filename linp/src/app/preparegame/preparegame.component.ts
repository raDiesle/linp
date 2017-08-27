import {Component, OnDestroy, OnInit} from '@angular/core';
import {RolesandwordsrequiredService} from '../gamelobby/rolesandwordsrequired.service';
import {Subject} from 'rxjs/Subject';
import {AngularFireDatabase} from 'angularfire2/database';
import {Game, GamePlayer} from '../models/game';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';
import {HttpClient, HttpParams} from '@angular/common/http';
import * as firebase from 'firebase/app';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-preparegame',
  templateUrl: './preparegame.component.html',
  styleUrls: ['./preparegame.component.scss']
})
export class PreparegameComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private rolesDistribution: { wordsNeeded: number; questionMarksNeeded: number };
  private gamePlayerSize: number;
  private hostUid: string;
  private gamePlayers: { [p: string]: GamePlayer };
  private authUser: firebase.User;
  public isRoleAssigned = false;
  private countdown: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              private httpClient: HttpClient,
              private rolesandwordsrequiredService: RolesandwordsrequiredService) {
  }

  ngOnInit() {
    const gameName = this.route.snapshot.paramMap.get('gamename');

    const start = 10;
    Observable
      .timer(1000, 1000)
      .map(count => start - count)
      .take(start + 1)
      .subscribe(count => {
        this.countdown = count
        if (count === 0) {
          this.startGame();
        }
      });


    this.db.object('/games/' + gameName)
      .takeUntil(this.ngUnsubscribe)
      // .toPromise()
      .subscribe((game: Game) => {
        this.gamePlayers = game.players;

        // trigger once
        if (this.authUser) {
          this.isRoleAssigned = !!this.gamePlayers[this.authUser.uid].questionmarkOrWord;
          return;
        }

        // pass to next promise instead
        this.hostUid = game.host;

        this.gamePlayerSize = Object.keys(game.players).length;
        this.rolesDistribution = this.rolesandwordsrequiredService.getRolesNeeded(this.gamePlayerSize);

        this.performHostOnlyServerTrigger(gameName);
      });
  }

  private performHostOnlyServerTrigger(gameName: string) {
// TODO combine promises
    this.afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe((authUser: firebase.User) => {
        this.authUser = authUser;
        // hostUid not null
        // hack to not have cheap non serverside trigger
        const isOnlyExecutedOnHostBrowser = this.authUser.uid === this.hostUid;
        if (isOnlyExecutedOnHostBrowser) {
          this.assignWordOnServerside(gameName);
        }
      });
  }

  private assignWordOnServerside(gameName: string) {
    const statusToCheck = 'STARTED';
    const cloudFunctionsDomain = 'https://us-central1-linp-c679b.cloudfunctions.net';
    const cloudFunction = '/wordRoleAssignment';
    const url = cloudFunctionsDomain + cloudFunction;
    this.httpClient
      .get(url,
        {
          // headers: headers,
          params: new HttpParams()
            .set('status', statusToCheck)
            .set('gameName', gameName)
        })
      .subscribe(response => {
        console.log('words assign on serversidedone');
      });
  }

  startGame(): void {
    // TODO solve host starts game navigation for all
    const gameName = this.route.snapshot.paramMap.get('gamename');
    this.router.navigate(['/firsttip', gameName]);
  }


  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
