import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {AngularFirestore} from 'angularfire2/firestore';
import {Game, GamePlayer, GameStatus} from '../models/game';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFireAuth} from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import {PreparegameService} from './preparegame.service';
import {FirebaseGameService} from '../services/firebasegame.service';

@Component({
  selector: 'app-preparegame',
  templateUrl: './preparegame.component.html',
  styleUrls: ['./preparegame.component.scss']
})
export class PreparegameComponent implements OnInit, OnDestroy {

  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private rolesDistributionInformation: { wordsNeeded: number; questionMarksNeeded: number };
  private gamePlayers: GamePlayer[];
  public isRoleAssigned = false;
  private isQuestionmark = false;
  private currentGamePlayer: GamePlayer;
  private gameName: string;
  private hasStartedGame = false;

  readonly NEXT_PLAYER_STATUS = 'READY_TO_START';
  readonly NEXT_PAGE: GameStatus = 'firsttip';

  private preparegameService = new PreparegameService();

  constructor(private route: ActivatedRoute,
              private router: Router,
              public db: AngularFirestore,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        this.router.navigate(['/' + game.status, this.gameName]);
      });

      this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      // .toPromise()
      .subscribe((gamePlayers: GamePlayer[]) => {
        this.gamePlayers = gamePlayers;
        // trigger once
        // if should be deprecated because auth promise dependance added
        this.rolesDistributionInformation = this.preparegameService.getRolesNeeded(gamePlayers.length);
        this.currentGamePlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.authUserUid;
        });
        this.isRoleAssigned = !!this.currentGamePlayer.questionmarkOrWord;
        this.isQuestionmark = this.currentGamePlayer.questionmarkOrWord === '?';
      });
  }

  startGameAction(): void {
    this.hasStartedGame = true;
    // TODO solve host starts game navigation for all
    this.firebaseGameService.updateCurrentGamePlayerStatus(this.gameName, this.NEXT_PLAYER_STATUS)
      .then(done => {
        this.navigateNextPage();
      });
  }

  private navigateNextPage() {
    this.router.navigate([this.NEXT_PAGE, this.gameName]);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
