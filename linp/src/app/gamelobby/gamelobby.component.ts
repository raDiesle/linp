import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Game, GamePlayer, GameStatus} from '../models/game';
import {Subject} from 'rxjs/Subject';
import {GamelobbyService} from './gamelobby-service';

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

  constructor(private router: Router,
              private route: ActivatedRoute,
              public db: AngularFirestore,
              public afAuth: AngularFireAuth,
              private gamelobbyService: GamelobbyService) {
  }

  ngOnInit(): void {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    const gamePlayersPromise = this.observeJoinedGamePlayers();
    const authPromise = this.afAuth.authState
      .takeUntil(this.ngUnsubscribe)
      .first()
      .toPromise()
      .then(authUser => {
        return this.authUserUid = authUser.uid;
      });

    Promise.all([gamePlayersPromise, authPromise])
      .then(promiseResults => {

        const gamePlayers = promiseResults[0];
        const isAlreadyJoined = gamePlayers.find(gamePlayr => {
          return gamePlayr.uid === this.authUserUid;
        }) !== undefined;
        if (isAlreadyJoined) {
          const gameChangePromise = this.promiseGameChanges();
          gameChangePromise
            .then(game => {
              this.hostUid = game.host;
              this.router.navigate(['/' + game.status, this.gameName]);
            });

          const fetchPlayerProfile = this.gamelobbyService.fetchPlayerProfileName(this.authUserUid)
          Promise.all([gameChangePromise, fetchPlayerProfile])
            .then(responses => {
              const game = responses[0] as Game;
              const isHost = this.authUserUid === game.host;
              const playerName = <string>responses[1];
              return this.addPlayerToGame(this.authUserUid, playerName, isHost);
            });
        }
      });
  }

  redirectToNextPage(): void {
    const isHostUser = this.authUserUid === this.hostUid;
    if (isHostUser) {
// TODO solve host starts game navigation for all
      this.updateGameStatusToNextPage();
    } else {
      this.staticAlertClosed = false;
      setTimeout(() => this.staticAlertClosed = true, 5000);
    }
  }


  private observeJoinedGamePlayers(): Promise<GamePlayer[]> {
    const observable = this.db
      .collection<Game>('games')
      .doc(this.gameName)
      .collection('players')
      .valueChanges()
      .takeUntil(this.ngUnsubscribe);
    observable
      .subscribe((gamePlayers: GamePlayer[]) => {
        this.gamePlayers = gamePlayers;
      });
    return <any>observable.first().toPromise();
  }

  public ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  private addPlayerToGame(uid: string, playerName: string, isHost: boolean): Promise<void> {
    // TODO extract to model
    const updatePlayer: GamePlayer = {
      uid: uid,
      name: playerName,
      isHost: isHost,
      status: 'JOINED_GAME',
// substract to initial model object
    };

// What if he joins again? Handle!
    return this.db
      .collection<GamePlayer>('games')
      .doc(this.gameName)
      .collection('players')
      .doc(uid)
      .set(updatePlayer);
  }

  private promiseGameChanges(): Promise<Game> {
    const promise = this.db
      .collection('games')
      .doc(this.gameName)
      .valueChanges()
      .first()
      .toPromise() as Promise<Game>;
    return promise;
  }

  private updateGameStatusToNextPage() {
    return this.db
      .collection<Game>('games')
      .doc(this.gameName)
      .update(<{ [status: string]: GameStatus }> {status: 'preparegame'});
  }
}
