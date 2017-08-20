import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {Game, GamePlayer} from '../models/game';
import {Subject} from 'rxjs/Subject';
import {HttpClient, HttpParams} from "@angular/common/http";

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit, OnDestroy {
  gamePlayerKeys: string[] = [];

  gameName: string;

  gamePlayers: { [uid: string]: GamePlayer }; // null
  private authUser: firebase.User;

  private statusToCheck: string = 'STARTED';

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private hostUid: string;


  constructor(private router: Router,
              private route: ActivatedRoute,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              private httpClient: HttpClient) {

    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
      });
  }

  ngOnInit(): void {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.db.object('/games/' + this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((game: Game) => {
        this.gamePlayers = game.players;
        this.hostUid = game.host;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
      });
  }

  startGame(): void {
    // hostUid not null
    // hack to not have cheap non serverside trigger
    const isOnlyExecutedOnHostBrowser = this.authUser.uid === this.hostUid;
    if (isOnlyExecutedOnHostBrowser) {
      this.assignWordOnServerside();
    }

    // TODO solve host starts game navigation for all
    this.router.navigate(['/firsttip', this.gameName]);
  }

  private assignWordOnServerside() {
    const cloudFunctionsDomain = 'https://us-central1-linp-c679b.cloudfunctions.net';
    const cloudFunction = '/wordRoleAssignment';
    const url = cloudFunctionsDomain + cloudFunction;
    this.httpClient
      .get(url,
        {
          // headers: headers,
          params: new HttpParams()
            .set('status', this.statusToCheck)
            .set('gameName', this.gameName)
        })
      .subscribe(response => {
        console.log('words assign on serversidedone');
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
