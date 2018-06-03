import {Component, OnDestroy, OnInit} from '@angular/core';

import {ActivatedRoute, Router} from '@angular/router';
import {GamePlayer, GamePlayerStatus} from 'app/models/game';
import {Subject} from 'rxjs/Subject';
import {FirebaseGameService} from '../../services/firebasegame.service';


@Component({
  selector: 'app-secondtip',
  templateUrl: '../tiptemplate.outlet.html',
  styleUrls: ['./secondtip.component.css']
})
export class SecondtipComponent implements OnInit, OnDestroy {

  public loggedInGamePlayer: GamePlayer;

  public isSecondtip = true;
  readonly NEXT_STATUS: GamePlayerStatus = 'SECOND_SYNONYM_GIVEN';

  public gamePlayers: GamePlayer[];
  private gameName: string;
  public savedResponseFlag = false;
  public isPlayersTurnForAuthUser = false;

  // @input
  private synonym: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private currentPlayer: GamePlayer;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        this.router.navigate([`/${game.status}`, this.gameName], {skipLocationChange: true});
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        const currentPlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.status !== this.NEXT_STATUS;
        });
        const isNextGameStatus = this.currentPlayer === null;
        if (isNextGameStatus) {
          return;
        }
        this.currentPlayer = currentPlayer;
        this.loggedInGamePlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.uid === this.firebaseGameService.getAuthUid();
        });
        this.isPlayersTurnForAuthUser = this.currentPlayer.uid === this.loggedInGamePlayer.uid;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
