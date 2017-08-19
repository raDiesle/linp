import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GamePlayer, GameStatus} from '../../models/game';
import {WordRoleAssignmentService} from '../word-role-assignment.service';

@Component({
  selector: 'app-firsttip',
  templateUrl: './firsttip.component.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit {
  gamePlayerKeys: string[];
  authUser: firebase.User;
  gamePlayers: { [uid: string]: GamePlayer };
  gameName: string;
  // @input
  private synonym: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              private wordRoleAssignmentService: WordRoleAssignmentService) {
    afAuth.authState
      .subscribe(authUser => {
        this.authUser = authUser;
      });
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    // might be done functional, might be separate view with redirect
    // might be async issue, put into callback


    const statusToCheck: GameStatus = 'FIRST_WORD_GIVEN';
    const nextPositiveRoute = '/firstguess';

    this.db.object('/games/' + this.gameName + '/players')
    // <GamePlayer[]>
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);

        this.wordRoleAssignmentService.assign(this.gamePlayerKeys, this.gamePlayers, this.gameName);

        this.observeGamePlayerStatus(gamePlayers, statusToCheck, nextPositiveRoute);
      });
  }

  private observeGamePlayerStatus(gamePlayers: { [uid: string]: GamePlayer }, statusToCheck: string, nextPositiveRoute: string) {
    Observable.pairs(gamePlayers)
      .flatMap(p => Observable.of(p))
      .pluck('status')
      .every(status => status === statusToCheck)
      .subscribe(allGivenFirstSynonym => {
          if (allGivenFirstSynonym) {
            this.router.navigate([nextPositiveRoute, this.gameName])
          }
        }
      );
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
}
