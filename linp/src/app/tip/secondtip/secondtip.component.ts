import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {ActivatedRoute, Router} from '@angular/router';
import {GamePlayer, GamePlayerStatus} from 'app/models/game';
import {Subject} from 'rxjs/Subject';
import {FirebaseGameService} from '../../services/firebasegame.service';
import {ActionguideService} from '../../services/actionguide.service';


@Component({
  selector: 'app-secondtip',
  templateUrl: '../tiptemplate.outlet.html',
  styleUrls: ['./secondtip.component.css']
})
export class SecondtipComponent implements OnInit, OnDestroy {

  public loggedInGamePlayer: GamePlayer;

  public isSecondtip = true;
  readonly NEXT_STATUS: GamePlayerStatus = 'SECOND_SYNONYM_GIVEN';
  readonly NEXT_PAGE = 'secondguess';
  readonly SYNONYM_KEY = 'secondSynonym';

  gamePlayers: GamePlayer[];
  gameName: string;
  public savedResponseFlag = false;
  public isPlayersTurnForAuthUser = false;
  public show$: boolean;
  // @input
  private synonym: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private currentPlayer: GamePlayer;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private firebaseGameService: FirebaseGameService,
              private actionguideService: ActionguideService) {
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
        if (this.isPlayersTurnForAuthUser === false) {
          this.actionguideService.triggerActionDone(this.gamePlayers);
        }
      });

    Observable.timer(0, 1000).subscribe(number => {
      this.show$ = number % 2 === 0;
    });
  }

  public sendSynonym() {
    const firstOrSecondGamePlayerUpdate = {
      status: this.NEXT_STATUS
    };
    firstOrSecondGamePlayerUpdate[this.SYNONYM_KEY] = this.synonym;

    this.firebaseGameService.sendSynonym(firstOrSecondGamePlayerUpdate, this.gameName)
      .then(() => {
        this.savedResponseFlag = true;
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
