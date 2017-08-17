import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GamePlayer} from '../models/game';
import {WordRoleAssignmentService} from './word-role-assignment.service';

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit {
  gamePlayerKeys: string[] = [];

  gameName: string;

  gamePlayers: { [uid: string]: GamePlayer }; // null
  private user: firebase.User;


  constructor(private router: Router,
              private route: ActivatedRoute,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              private wordRoleAssignmentService: WordRoleAssignmentService) {

    afAuth.authState.subscribe(data => {
      this.user = data;
    });
  }

  ngOnInit(): void {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.db.object('/games/' + this.gameName + '/players')
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
      });
  }

  startGame(): void {
    // might be done functional
    this.wordRoleAssignmentService.assign(this.gamePlayerKeys, this.gamePlayers, this.gameName);
    // might be async issue, put into callback
    this.router.navigate(['/firsttip', this.gameName]);
  }
}
