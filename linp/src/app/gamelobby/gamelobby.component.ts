import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GamePlayer} from '../models/game';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit, OnDestroy {
  gamePlayerKeys: string[] = [];

  gameName: string;

  gamePlayers: { [uid: string]: GamePlayer }; // null
  private user: firebase.User;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private router: Router,
              private route: ActivatedRoute,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {

    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
        this.user = data;
      });
  }

  ngOnInit(): void {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.db.object('/games/' + this.gameName + '/players')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
      });
  }

  startGame(): void {
    this.router.navigate(['/firsttip', this.gameName]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
