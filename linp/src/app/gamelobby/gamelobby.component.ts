import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {Game, GamePlayer} from '../models/game';
import {Subject} from 'rxjs/Subject';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit, OnDestroy {

  currentHrefLink: string = window.location.href;
  gamePlayerKeys: string[] = [];

  gameName: string;
// TODO https://cedvdb.github.io/ng2share/
  gamePlayers: { [uid: string]: GamePlayer }; // null
  private authUser: firebase.User;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private hostUid: string;
  staticAlertClosed = true;
  private _success = new Subject<string>();

  constructor(private router: Router,
              private route: ActivatedRoute,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {

  }

  ngOnInit(): void {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
    this.afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
      });

    this.db.object('/games/' + this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((game: Game) => {
        this.gamePlayers = game.players;
        this.hostUid = game.host;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
      });
  }

  prepareGame(): void {
    const isHostUser = this.authUser.uid === this.hostUid;
    if (isHostUser) {
      // TODO solve host starts game navigation for all
      this.router.navigate(['/preparegame', this.gameName]);
    } else {
      this.staticAlertClosed = false;
      setTimeout(() => this.staticAlertClosed = true, 5000);

    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
