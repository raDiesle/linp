import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {HttpClient} from '@angular/common/http';
import {Game, GamePlayer, GameStatus} from '../models/game';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {PlayerProfile} from '../models/player';
import {LANGUAGE} from '../models/context';
import {ActivatedRoute} from '@angular/router';

@Injectable()
export class FirebaseGameService {
  public authUserUid: string;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private httpClient: HttpClient,
              private route: ActivatedRoute) {
    this.observeAuthUser();
  }


  // deprecated
  public observeAuthUser(): Observable<firebase.User> {
    const observable = this.afAuth.authState;
    observable.subscribe(authUser => {
      this.authUserUid = authUser.uid;
    });
    return this.afAuth.authState;
  }

  public observeGame(gameName): Observable<Game> {
    const promise = this.db
      .collection('games')
      .doc<Game>(gameName)
      .valueChanges()
    return promise;
  }

  public observeGames(): Observable<Game[]> {
    return this.db
      .collection<Game>('games')
      .valueChanges()
  }

  observeLoggedInPlayerProfile(): Observable<PlayerProfile> {
    return this.db
      .collection('players')
      .doc(this.afAuth.auth.currentUser.uid)
      .valueChanges();
  }

  writeGame(gameName: string, language: LANGUAGE): Promise<void> {
    const newGame = this.getGameObject(gameName, language);
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .set(<Game>newGame);
  }

  public addLoggedInPlayerToGame(gameName: string) {
    Promise.all([this.observeGame(gameName).first().toPromise(),
      this.observeLoggedInPlayerProfile().first().toPromise()])
      .then(responses => {
        const game = responses[0] as Game;
        const loggedInPlayerIsHost = this.afAuth.auth.currentUser.uid === game.host;
        const playerName = (<PlayerProfile>responses[1]).name;
        return this.addPlayerToGame(gameName, playerName, loggedInPlayerIsHost);
      });
  }

  observeGamePlayers(gameName: string) {
    const observable = this.db
      .collection<Game>('games')
      .doc(gameName)
      .collection('players')
      .valueChanges();
    return observable;
  }

  private addPlayerToGame(gameName: string, playerName: string, isHost: boolean): Promise<void> {
    // TODO extract to model
    const updatePlayer: GamePlayer = {
      uid: this.afAuth.auth.currentUser.uid,
      name: playerName,
      isHost: isHost,
      status: 'JOINED_GAME',
// substract to initial model object
    };

// What if he joins again? Handle!
    return this.db
      .collection<GamePlayer>('games')
      .doc(gameName)
      .collection('players')
      .doc(this.afAuth.auth.currentUser.uid)
      .set(updatePlayer);
  }

  public updateGameStatus(newStatus: GameStatus, gameName: string): Promise<void> {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .update(<{ [status: string]: GameStatus }> {status: newStatus});
  }

  private getGameObject(gameName: string, language: LANGUAGE) {
    const STARTING_ROUND = 0;
    return {
      name: gameName,
      host: this.afAuth.auth.currentUser.uid,
      status: 'gamelobby' as GameStatus,
      players: [],
      round: STARTING_ROUND,
      createdAt: Date.now(),
      language: language,
      pointsScored: {}
    };
  }
}
