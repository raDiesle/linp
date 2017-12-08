import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Game, GamePlayer, GameStatus} from '../models/game';
import {Subject} from 'rxjs/Subject';
import {GamelobbyService} from './gamelobby-service';
import {FirebaseGameService} from '../services/firebasegame.service';
import {PlayerProfile} from "../models/player";

@Component({
  selector: 'app-gamelobby',
  templateUrl: './gamelobby.component.html',
  styleUrls: ['./gamelobby.component.css']
})
export class GamelobbyComponent implements OnInit, OnDestroy {

  gamePlayerKeys: string[] = [];

  gameName: string;
// TODO https://cedvdb.github.io/ng2share/
  gamePlayers: GamePlayer[] = []; // null
  staticAlertClosed = true;
  private authUserUid: string;
  private hostUid: string;
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private loggedInPlayerIsHost = false;
  private hostPlayerName: string;

  constructor(private router: Router,
              private route: ActivatedRoute,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth,
              private gamelobbyService: GamelobbyService,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit(): void {
    const gameName = this.route.snapshot.paramMap.get('gamename');
    this.gameName = gameName;

    this.firebaseGameService.observeGamePlayers(gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe((gamePlayers: GamePlayer[]) => {
        this.gamePlayers = gamePlayers;


        const loggedInUser = gamePlayers.find(gamePlayr => {
          return gamePlayr.uid === this.firebaseGameService.authUserUid;
        });
        const isAlreadyJoined = loggedInUser !== undefined;
        this.loggedInPlayerIsHost = loggedInUser && loggedInUser.isHost;

        if (isAlreadyJoined) {
          this.firebaseGameService.observeGame(this.gameName).first().toPromise()
            .then(game => {
              this.router.navigate(['/' + game.status, this.gameName]);
            });
          this.hostPlayerName = gamePlayers.find(gamePlayr => {
            return gamePlayr.isHost;
          }).name;
        } else {
          this.firebaseGameService.addLoggedInPlayerToGame(this.gameName);

        }
      });
  }

  startGame(): void {
    this.updateGameStatusToNextPage();
  }

  private updateGameStatusToNextPage() {
    return this.db
      .collection<Game>('games')
      .doc(this.gameName)
      .update(<{ [status: string]: GameStatus }> {status: 'preparegame'});
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
