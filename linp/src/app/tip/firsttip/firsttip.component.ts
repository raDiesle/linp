import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { GamePlayer, GamePlayerStatus, GameStatus } from 'app/models/game';
import { Subject } from 'rxjs/Subject';
import { FirebaseGameService } from '../../services/firebasegame.service';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-firsttip',
  templateUrl: '../tiptemplate.outlet.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit, OnDestroy {

  public loggedInGamePlayer: GamePlayer;

  public isSecondtip: boolean = null;

  readonly NEXT_STATUS: GamePlayerStatus = 'FIRST_SYNONYM_GIVEN';

  public isPlayersTurnForAuthUser: boolean = null;

  public gamePlayers: GamePlayer[];
  private gameName: GameStatus;

  private ngUnsubscribe: Subject<void> = new Subject<void>();

  private currentPlayer: GamePlayer;

  constructor(private route: ActivatedRoute,
    private router: Router,
    public db: AngularFirestore,
    public afAuth: AngularFireAuth,
    private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename') as GameStatus;
    const gameStatus: GameStatus = this.route.snapshot.url[0].path as GameStatus;
    this.isSecondtip = gameStatus === 'secondtip';

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        if (game.status === 'evaluation' || game.status === 'finalizeround') {
          return;
        }
        this.router.navigate(['/' + game.status, this.gameName], { skipLocationChange: true });
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        // Hack of some unknown bug, jumps into twice
        if (gamePlayers.length === 1) {
          return
        }
        this.gamePlayers = gamePlayers;

        const nextPlayerIndex = this.gamePlayers.findIndex(gamePlayer => {
          return gamePlayer.status !== 'FIRST_SYNONYM_GIVEN';
        });
        this.currentPlayer = gamePlayers[nextPlayerIndex];

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
