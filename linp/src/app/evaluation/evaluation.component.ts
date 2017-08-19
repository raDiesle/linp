import {Component, OnInit} from '@angular/core';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {ActivatedRoute, Router} from '@angular/router';
import * as firebase from 'firebase/app';
import {AngularFireDatabase} from 'angularfire2/database';
import {GamePlayer, PointsScored, TeamTip} from '../models/game';
import {Observable} from 'rxjs/Observable';
import {first} from "rxjs/operator/first";


@Component({
  selector: 'app-evaluation',
  templateUrl: './evaluation.component.html',
  styleUrls: ['./evaluation.component.css']
})
export class EvaluationComponent implements OnInit {

  authUser: firebase.User;
  gameName: string;
  gamePlayers: { [uid: string]: GamePlayer };
  gamePlayerKeys: string[];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
    const gamePlayersObservable = this.db.object('/games/' + this.gameName + '/players'
      , {preserveSnapshot: true})
      .subscribe(gamePlayers => {
      console.log('changed');
      this.gamePlayers = gamePlayers.val();
      this.gamePlayerKeys = Object.keys(this.gamePlayers);
      gamePlayersObservable.unsubscribe();

      // to be moved to server, executable only once
      // this.resetPoints(this.gamePlayers);
      // this.evaluate();
      // async issues
      /*
      this.db.object('games/' + this.gameName + '/players/')
      // reduce to only update totalRounds
        .update(this.gamePlayers)
        .then(response => console.log(response));
    });
    */
    });
  }

  startNextRound() {
    this.router.navigate(['/firsttip', this.gameName]);
  }
}
