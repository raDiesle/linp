import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {GamePlayer, GamePlayerStatus, GameStatus} from 'app/models/game';
import {Subject} from 'rxjs/Subject';
import {FirebaseGameService} from '../../services/firebasegame.service';
import {AngularFireAuth} from 'angularfire2/auth';

@Component({
  selector: 'app-firsttip',
  templateUrl: '../tiptemplate.outlet.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit, OnDestroy {
  public loggedInGamePlayer: GamePlayer;

  public isSecondtip = false;

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

    this.firebaseGameService.observeGame(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(game => {
        if (game.status === 'evaluation' || game.status === 'finalizeround') {
          return;
        }
        this.router.navigate(['/' + game.status, this.gameName], {skipLocationChange: true});
      });

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
        this.currentPlayer = this.gamePlayers.find(gamePlayer => {
          return gamePlayer.status !== this.NEXT_STATUS;
        });
        const isNextGameStatusSwitch = this.currentPlayer === null;
        if (isNextGameStatusSwitch) {
          return;
        }

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
