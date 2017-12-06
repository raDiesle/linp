import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AngularFirestore} from 'angularfire2/firestore';
import {Game, GamePlayer, GameStatus} from '../models/game';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import {PreparegameService} from './preparegame.service';

@Component({
  selector: 'app-preparegame',
  templateUrl: './preparegame.component.html',
  styleUrls: ['./preparegame.component.scss']
})
export class PreparegameComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private rolesDistributionInformation: { wordsNeeded: number; questionMarksNeeded: number };
  private hostUid: string;
  private gamePlayers: GamePlayer[];
  private authUser: firebase.User;
  public isRoleAssigned = false;
  private isQuestionmark = false;
  private currentGamePlayer: GamePlayer;
  private gameName: string;
  private hasStartedGame = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth,
              private preparegameService: PreparegameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    const authPromise = this.afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .first()
      .toPromise();

    const gamePromise = this.db.collection('games')
      .doc(this.gameName)
      .valueChanges()
      .first()
      .toPromise();

    Promise.all([authPromise, gamePromise])
      .then(results => {
        this.authUser = <firebase.User>results[0];
        // pass to next promise instead . ts bug with type
        const game = <any>results[1];
        this.hostUid = game.host;
        this.registerGamePlayerChangeActions(this.gameName);
      });
  }

  startGameAction(): void {
    this.hasStartedGame = true;
    // TODO solve host starts game navigation for all
    const isOnlyExecutedOnHostBrowser = this.authUser.uid === this.hostUid;

    const updateGamePlayerStatusPromise = this.preparegameService.updateGamePlayerStatusReady(this.authUser.uid, this.gameName);

    if (!isOnlyExecutedOnHostBrowser) {
      updateGamePlayerStatusPromise
        .then(done => {
          this.navigateNextPage();
        });
    } else {
      // correct would be to update gamestatus when all gameplayerstatus changed
      const updateGameStatusPromise = this.preparegameService.updateGameStatusToNextPage(this.gameName);
      Promise.all([updateGamePlayerStatusPromise, updateGameStatusPromise])
        .then(done => {
          this.navigateNextPage();
        });
    }
  }

  private registerGamePlayerChangeActions(gameName: string) {
    this.db
      .collection('games')
      .doc(gameName)
      .collection('players')
      .valueChanges()
      .takeUntil(this.ngUnsubscribe)
      // .toPromise()
      .subscribe((gamePlayers: GamePlayer[]) => {
        this.gamePlayers = gamePlayers;
        // trigger once
        // if should be deprecated because auth promise dependance added
        if (this.authUser) {
          this.setAssignedWordOrRoleInformation();
          return;
        }
        this.rolesDistributionInformation = this.preparegameService.getRolesNeeded(gamePlayers.length);

        // hack to not have cheap non serverside trigger
        const isOnlyExecutedOnHostBrowser = this.authUser.uid === this.hostUid;
        if (isOnlyExecutedOnHostBrowser) {
          this.preparegameService.assignWordOnServerside(gameName)
            .subscribe(response => {
              console.log('words assign on serversidedone');
            });
        }
      });
  }

  private setAssignedWordOrRoleInformation() {
    this.currentGamePlayer = this.gamePlayers.find(gamePlayer => {
      return gamePlayer.uid === this.authUser.uid;
    });
    this.isRoleAssigned = !!this.currentGamePlayer.questionmarkOrWord;
    this.isQuestionmark = this.currentGamePlayer.questionmarkOrWord === '?';
  }

  private navigateNextPage() {
    this.router.navigate(['/firsttip', this.gameName]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
