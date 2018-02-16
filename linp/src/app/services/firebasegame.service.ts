import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';
import {HttpClient} from '@angular/common/http';
import {Game, GamePlayer, GamePlayerStatus, GameStatus, SynonymKey} from '../models/game';
import {Observable} from 'rxjs/Observable';
import * as firebase from 'firebase';
import {AngularFireAuth} from 'angularfire2/auth';
import {PlayerProfile} from '../models/player';
import {LANGUAGE} from '../models/context';
import {ActivatedRoute} from '@angular/router';

@Injectable()
export class FirebaseGameService {
  readonly INITIAL_STATUS = 'JOINED_GAME';
  public authUserUid: string;

  constructor(private afAuth: AngularFireAuth,
              private db: AngularFirestore,
              private httpClient: HttpClient,
              private route: ActivatedRoute) {
    // this.observeAuthUser();
  }

  // deprecated
  public observeAuthUser(): Observable<firebase.User> {
    const observable = this.afAuth.authState;
    observable.subscribe(authUser => {
      this.authUserUid = authUser ? authUser.uid : '';
    });
    return this.afAuth.authState;
  }

  public observeGame(gameName): Observable<Game> {
    const observable = this.db
      .collection('games')
      .doc<Game>(gameName)
      .valueChanges()
    return observable;
  }

  public observeGames(): Observable<Game[]> {
    return this.db
      .collection<Game>('games')
      .valueChanges()
  }

  public observeLoggedInPlayerProfile(): Observable<PlayerProfile> {
    return this.db
      .collection('players')
      .doc(this.afAuth.auth.currentUser.uid)
      .valueChanges();
  }

  public writeGame(gameName: string, language: LANGUAGE): Promise<void> {
    const newGame = this.getGameObject(gameName, language);
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .set(<Game>newGame);
  }

  public observeGamePlayers(gameName: string) {
    const observable = this.db
      .collection<Game>('games')
      .doc(gameName)
      .collection('players')
      .valueChanges();
    return observable;
  }

  public deleteGame(gameName: string): Promise<void> {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .delete()
  }

  public updateGameStatus(newStatus: GameStatus, gameName: string): Promise<void> {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .update(<{ [status: string]: GameStatus }> {status: newStatus});
  }

  public updateCurrentGamePlayerStatus(gameName: string, status: GamePlayerStatus) {
    return this.updateGamePlayerStatus(this.authUserUid, gameName, status);
  }

  public updateGamePlayerStatus(authUser: string, gameName: string, status: GamePlayerStatus) {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .collection('players')
      .doc(authUser)
      .update(<{ [status: string]: GamePlayerStatus }> {status: status});
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

  public addLoggedInPlayerToGame(gameName: string): Promise<void> {
    return Promise.all([this.observeGame(gameName).first().toPromise(),
      this.observeLoggedInPlayerProfile().first().toPromise()])
      .then(responses => {
        const game = responses[0] as Game;
        // not needed
        const loggedInPlayerIsHost = this.afAuth.auth.currentUser.uid === game.host;
        const playerName = (<PlayerProfile>responses[1]).name;
        return this.addPlayerToGame(gameName, playerName, loggedInPlayerIsHost);
      });
  }

  public resetPlayer(gameName: string) {
    const requestModel: any = {
      ['firstSynonym']: firebase.firestore.FieldValue.delete(),
      ['firstTeamTip']: firebase.firestore.FieldValue.delete(),
      ['pointsScored']: firebase.firestore.FieldValue.delete(),
      /*
        {
      ['firstTeamTip']: firebase.firestore.FieldValue.delete(),
        ['indirect']: firebase.firestore.FieldValue.delete(),
        ['secondTeamTip']: firebase.firestore.FieldValue.delete(),
        ['total']: firebase.firestore.FieldValue.delete(),
        // totalRounds
      },
      */
      ['questionmarkOrWord']: firebase.firestore.FieldValue.delete(),
      ['secondSynonym']: firebase.firestore.FieldValue.delete(),
      ['secondTeamTip']: firebase.firestore.FieldValue.delete(),
      ['status']: 'READY_TO_START',
      ['totalRanking']: firebase.firestore.FieldValue.delete()
    };

    return this.updateGamePlayer(requestModel, gameName);
  }

  private addPlayerToGame(gameName: string, playerName: string, isHost: boolean): Promise<void> {
    // TODO extract to model
    const updatePlayer: GamePlayer = {
      uid: this.afAuth.auth.currentUser.uid,
      name: playerName,
      isHost: isHost,
      status: this.INITIAL_STATUS,
      // TODO update on all places to order by pos when fetching
      pos: this.random53()
// substract to initial model object
    };

// What if he joins again? Handle!
    console.log(this.afAuth.auth.currentUser.uid);

    return this.db
      .collection<GamePlayer>('games')
      .doc(gameName)
      .collection('players')
      .doc(this.afAuth.auth.currentUser.uid)
      .set(updatePlayer);
  }

  public sendSynonym(firstOrSecondGamePlayerUpdate: GamePlayer, gameName: string): Promise<void> {
    return this.db.collection('games')
      .doc(gameName)
      .collection('players')
      .doc(this.authUserUid)
      .update(firstOrSecondGamePlayerUpdate)
  }

  public updateGamePlayer(requestModel: GamePlayer, gameName: string) {
    return this.db.collection('games')
      .doc(gameName)
      .collection<GamePlayer>('players')
      .doc(this.authUserUid)
      .update(
        requestModel
      );
  }

  private random53(): number {
    return Math.floor(Number.MAX_SAFE_INTEGER * (2 * (Math.random() - 0.5)));
  }
}
