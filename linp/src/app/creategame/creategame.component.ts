import {Component, OnDestroy, OnInit} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth';
import {Game, GamePlayer} from '../models/game';
import * as firebase from 'firebase/app';
import {Subject} from 'rxjs/Subject';
import {Router} from '@angular/router';

@Component({
  selector: 'app-creategame',
  templateUrl: './creategame.component.html',
  styleUrls: ['./creategame.component.css']
})
export class CreategameComponent implements OnInit, OnDestroy {

  gameName = '';
  private authUser: firebase.User;

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private playerName: string;

  constructor(public afAuth: AngularFireAuth,
              public db: AngularFirestore,
              public router: Router) {
    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;

        const uid = authUser.uid;
        this.db.doc<GamePlayer>('/players/' + uid)
          .valueChanges()
          .takeUntil(this.ngUnsubscribe)
          .subscribe(playerProfile => {
            this.gameName = playerProfile.name;
            this.playerName = playerProfile.name;
          });
      });
  }

  ngOnInit() {
  }

  // To be extracted to service
  createGameAction(): void {
    const playerName = this.playerName;
    const gameName = this.gameName;

    // extract to model
    const newGame: Game = {
      name: gameName,
      host: this.authUser.uid,
      status: 'gamelobby',
      players: [],
      round: 0
    };

    this.db
      .collection<Game>('games/')
      .doc(gameName)
      .set(<Game>newGame);

    this.router.navigate(['/gamelobby', gameName]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
