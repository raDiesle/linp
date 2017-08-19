import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireDatabase} from 'angularfire2/database';
import {GamePlayer, TeamPartner, TeamTip} from '../../models/game';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import * as firebase from 'firebase/app';
import {GuessService} from '../guess.service';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-firstguess',
  templateUrl: './firstguess.component.html',
  styleUrls: ['./firstguess.component.css']
})
export class FirstguessComponent implements OnInit, OnDestroy {
  authUser: firebase.User;
  gameName: string;

  selectedGamePlayers: GamePlayer[] = [];
  gamePlayers: { [uid: string]: GamePlayer };
  private gamePlayerKeys: string[];

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth,
              public guessService: GuessService) {
    afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .subscribe(data => {
      this.authUser = data;
    });
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');
    this.db.object('/games/' + this.gameName + '/players')
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.gamePlayerKeys = Object.keys(this.gamePlayers);
      });
  }

  onTeamPlayerGuessSelected(clickedGamePlayer): void {
    //  TODO make it non modifyable with rxjs, { ...this.selectedGamePlayers}
    this.selectedGamePlayers = this.guessService.onTeamPlayerGuessSelected(this.selectedGamePlayers, clickedGamePlayer);
  }

  saveFirstTeamTip(): void {
    const createGuessModel = function (selectedGamePlayers) {
      const firstTeamTip: TeamTip = {
        firstPartner: {
          uid: selectedGamePlayers[0].uid,
          name: selectedGamePlayers[0].name
        },
        secondPartner: {
          uid: selectedGamePlayers[1].uid,
          name: selectedGamePlayers[0]
        }
      };
      return firstTeamTip;
    };
// move to model
    const firstTeamTip = createGuessModel(this.selectedGamePlayers);
    const tipDBkey = '/firstTeamTip';
    this.db.object('games/' + this.gameName + '/players/' + this.authUser.uid + tipDBkey)
      .set(firstTeamTip)
      .then(firstTeamTip => {
        alert('Successful saved choice');
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
