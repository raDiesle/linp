import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {AngularFireAuth} from 'angularfire2/auth/auth';
import {Game, GamePlayer, GameStatusRoutes} from '../models/game';
import {Subject} from 'rxjs/Subject';

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
              public afAuth: AngularFireAuth) {
  }

  ngOnInit(): void {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    // this.hostUid = game.host;

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
        });
// game.status !== 'gamelobby' &&  if page refreshed with same route, we need
        if (isAlreadyJoined !== undefined) {
          this.redirectToCurrentGameStatusUrl();
        } else {
          this.registerPlayerToGame();
        }
      })
  }

  prepareGame(): void {
    const isHostUser = this.authUserUid === this.hostUid;
    if (isHostUser) {
// TODO solve host starts game navigation for all
      this.router.navigate(['/preparegame', this.gameName]);
    } else {
      this.staticAlertClosed = false;
      setTimeout(() => this.staticAlertClosed = true, 5000);
    }
  }

  private registerPlayerToGame() {
    console.log('called');
    this.fetchPlayerProfile(this.authUserUid)
      .then(playerName => {
        this.addPlayerToGame(this.authUserUid, playerName);
      });
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
    return observable.first().toPromise();
  }

  private addPlayerToGame(uid: string, playerName: string): Promise<void> {
    // TODO extract to model
    const updatePlayer: GamePlayer = {
      uid: uid,
      name: playerName,
      status: 'JOINED_GAME',
// substract to initial model object
    };

// What if he joins again? Handle!
    return this.db
      .collection<GamePlayer>('games/')
      .doc(this.gameName)
      .collection('/players')
      .doc(uid)
      .set(updatePlayer);
  }

  private fetchPlayerProfile(uid: string): Promise<string> {
    return this.db.collection('/players/')
      .doc(uid)
      .valueChanges()
      .first()
      .toPromise()
      .then(playerProfile => {
          return (<GamePlayer>playerProfile).name;
        }
      );
  }

  private redirectToCurrentGameStatusUrl() {
    this.db
      .collection('games/')
      .doc(this.gameName)
      .valueChanges()
      .first()
      .toPromise()
      .then(game => {
        const status = (<Game>game).status;
        this.router.navigate(['/' + status, this.gameName]);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
