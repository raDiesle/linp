import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GamePlayer, GameStatus} from '../../models/game';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-firsttip',
  templateUrl: './firsttip.component.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit, OnDestroy {
  gamePlayerKeys: string[];
  authUser: firebase.User;
  gamePlayers: { [uid: string]: GamePlayer };
  gameName: string;
  // @input
  private synonym: string;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {
    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(authUser => {
        this.authUser = authUser;
      });
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    // might be done functional, might be separate view with redirect
    // might be async issue, put into callback


    this.db.object('/games/' + this.gameName + '/players')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);

// TODO BIG move to server
// this.wordRoleAssignmentService.assign(this.gamePlayerKeys, this.gamePlayers, this.gameName);

        this.observeGamePlayerStatus(gamePlayers);
      });
  }

  private observeGamePlayerStatus(gamePlayers: { [uid: string]: GamePlayer }) {
    const nextPositiveRoute = '/firstguess';
    const statusToCheck: GameStatus = 'FIRST_WORD_GIVEN';
    return Observable.pairs(gamePlayers)
      .flatMap(p => Observable.of(p))
      .pluck('status')
      .every(status => status === statusToCheck)
      .toPromise()
      .then(allGivenFirstSynonym => {
        if (allGivenFirstSynonym) {
          this.router.navigate([nextPositiveRoute, this.gameName]);
        }
      });
  }


  sendSynonym() {
    const gamePlayerUpdate = {
      status: 'FIRST_WORD_GIVEN',
      firstSynonym: this.synonym
    };
    this.db.object('games/' + this.gameName + '/players/' + this.authUser.uid)
      .update(gamePlayerUpdate)
      .then(gamePlayerModel => alert('Successful saved'));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
