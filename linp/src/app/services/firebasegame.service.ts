import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Game, GamePlayer, GamePlayerStatus, GameStatus } from 'app/models/game';
// import { Observable } from 'rxjs/Observable';
import {Observable} from 'rxjs/Rx';

import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { ActivePlayerGame, PlayerFriendlist, PlayerProfile } from 'app/models/player';
import { LANGUAGE } from '../models/context';

@Injectable()
export class FirebaseGameService {

  readonly INITIAL_STATUS = 'JOINED_GAME';
  public authUserUid: string;

  constructor(
    private afAuth: AngularFireAuth,
    private db: AngularFirestore) {
  }

  // deprecated
  public observeAuthUser(): Observable<firebase.User> {
    const observable = this.afAuth.authState;
    observable.subscribe(authUser => {
      this.authUserUid = authUser ? authUser.uid : null;
    });
    return this.afAuth.authState;
  }

  public isLoggedIn(): boolean {
    return this.authUserUid !== null && this.authUserUid !== '';
  }

  public isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }

  public registerUpdateGamePlayerOnlineTrigger(uid: string) {
    // Fetch the current user's ID from Firebase Authentication.
    // const uid = this.getAuthUid();

    // Create a reference to this user's specific status node.
    // This is where we will store data about being online/offline.
    const userStatusDatabaseRef = firebase.database().ref('/status/' + uid);
    const userStatusFirestoreRef = firebase.firestore().doc('/status/' + uid);

    // We'll create two constants which we will write to
    // the Realtime database when this device is offline
    // or online.
    const isOfflineForDatabase = {
      state: 'offline',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    const isOnlineForDatabase = {
      state: 'online',
      last_changed: firebase.database.ServerValue.TIMESTAMP,
    };

    const isOnlineForFirestore = {
      state: 'online',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };

    firebase.database()
      .ref('.info/connected')
      .on('value', (snapshot) => {

        if (snapshot.val() === false) {
          // Instead of simply returning, we'll also set Firestore's state
          // to 'offline'. This ensures that our Firestore cache is aware
          // of the switch to 'offline.'

          this.setAuthUserOffline();
          return;
        }

        userStatusDatabaseRef
          .onDisconnect()
          .set(isOfflineForDatabase)
          .then(() => {
            userStatusDatabaseRef.set(isOnlineForDatabase);
            // We'll also add Firestore set here for when we come online.
            userStatusFirestoreRef.set(isOnlineForFirestore);
          });
      });
  }

  public setAuthUserOffline(): Promise<any> {
    // Firestore uses a different server timestamp value, so we'll
    // create two more constants for Firestore state.
    const isOfflineForFirestore = {
      state: 'offline',
      last_changed: firebase.firestore.FieldValue.serverTimestamp(),
    };
    const userStatusFirestoreRef = firebase.firestore().doc('/status/' + this.getAuthUid());
    // might also update firestore
    return userStatusFirestoreRef.set(isOfflineForFirestore);
  }

  public getAuthUid(): string {
    return this.authUserUid;
  }

  public updatePlayerUiState(request: any): Promise<any> {
    return this.db
      .collection('players')
      .doc(this.getAuthUid())
      .update(request);
  }

  public observeGame(gameName): Observable<Game> {
    return this.db
      .collection('games')
      .doc<Game>(gameName)
      .valueChanges();
  }

  public observePublicGamesToJoin(): Observable<Game[]> {
    return this.db.collection<Game>('games', (ref) => {
      return ref.where('status', '==', 'gamelobby')
        .where('visibilityPrivate', '==', false);
    })
      .valueChanges()
  }

  public observePrivateGamesToJoin(): Observable<Game[]> {
    return this.db.collection<Game>('games', (ref) => {
      return ref.where('status', '==', 'gamelobby')
        .where('visibilityPrivate', '==', true);
    })
      .valueChanges()
  }

  public observeActivegamesOfPlayer(): Observable<ActivePlayerGame[]> {
    return this.observeActivegamesOfSpecificPlayer(this.getAuthUid());
  }

  public observeActivegamesOfSpecificPlayer(uid: string): Observable<ActivePlayerGame[]> {
    return this.db
      .collection<Game>('players')
      .doc(uid)
      .collection<ActivePlayerGame>('activegames', ref => ref.orderBy('since'))
      .valueChanges()
  }

  observeCurrentPlayersFriendslist(): Observable<PlayerFriendlist[]> {
    return this.db
      .collection<PlayerProfile>('players')
      .doc(this.afAuth.auth.currentUser.uid)
      .collection<PlayerFriendlist>('friendlist')
      .valueChanges();
  }

  public observeLoggedInPlayerProfile(): Observable<PlayerProfile> {
    // for any reason auth can become null
    return this.observeAuthUser().flatMap((user) => {
      const isLoggedIn = user === null;
      return isLoggedIn ? Observable.of(null) : this.observePlayerProfile(this.getAuthUid());
    });
  }

  public observePlayerProfile(uid: string): Observable<PlayerProfile> {
    return this.db
      .collection('players')
      .doc<PlayerProfile>(uid)
      .valueChanges();
  }

  public writeGame(gameName: string, language: LANGUAGE): Promise<void> {
    const newGame = this.getGameObject(gameName, language);
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .set(<Game>newGame);
  }

  public observeGamePlayers(gameName: string): Observable<GamePlayer[]> {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .collection('players')
      .valueChanges();
  }

  public addChat(gameName: string, message: string, currentPlayerName: string): Promise<any> {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .collection('chats')
      .add({
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        from: currentPlayerName,
        msg: message
      });
  }

  public observeGameChats(gameName: string): Observable<GamePlayer[]> {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .collection('chats', ref => ref.orderBy('timestamp', 'asc'))
      .valueChanges();
  }

  public observeLoggedInGamePlayer(gameName: string): Observable<GamePlayer> {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .collection('players')
      .doc(this.afAuth.auth.currentUser.uid)
      .valueChanges();
  }

  public deleteGame(gameName: string): Promise<any> {

    const deleteGamePromise: Promise<any> = this.db
      .collection<Game>('games')
      .doc(gameName)
      .delete().then(() => {
        console.error('deleted');
        return Promise.resolve();
      }).catch(error => {
        console.error(error);
      });

    const removeFromReferencesGamesPromise = this.observeGamePlayers(gameName).first().toPromise()
      .then(gamePlayers => {
        const allDeleted: Promise<any>[] = [];
        gamePlayers.forEach(gamePlayer => {
          allDeleted.push(this.deleteActiveGameRef(gamePlayer, gameName));
          allDeleted.push(this.deleteGamePlayersRef(gamePlayer, gameName));
        });
        return Promise.all(allDeleted);
      });
    return Promise.all([deleteGamePromise, removeFromReferencesGamesPromise]);
  }

  public updateGameStatus(newStatus: GameStatus, gameName: string): Promise<void> {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .update(<{ [status: string]: GameStatus }>{ status: newStatus });
  }

  public updateGameVisibility(isPrivate: boolean, gameName: string): Promise<void> {
    return this.db.collection<Game>('games')
      .doc<Game>(gameName)
      .update({
        visibilityPrivate: isPrivate
      })
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
      .update(<{ [status: string]: GamePlayerStatus }>{ status: status });
  }

  public addLoggedInPlayerToGame(gameName: string): Promise<[[void, void], void]> {
    // TODO might be reduced to call
    const uid = this.afAuth.auth.currentUser.uid;
    return Promise.all([this.observeGame(gameName).first().toPromise(),
    this.observeLoggedInPlayerProfile().first().toPromise()])
      .then(responses => {
        const game = responses[0] as Game;
        // not needed
        const isLoggedInPlayerHost = uid === game.host;
        const playerName = (<PlayerProfile>responses[1]).name;
        const gamePromise = this.addCurrentPlayerToGame(gameName, playerName, isLoggedInPlayerHost);
        const playerPromise = this.addActiveGameToPlayer(gameName, uid, isLoggedInPlayerHost);
        return Promise.all([gamePromise, playerPromise]);
      });
  }

  public addCurrentPlayerToGame(gameName: string, playerName: string, isHost: boolean): Promise<[void, void]> {
    const uid = this.afAuth.auth.currentUser.uid;
    return Promise.all([this.addAPlayerToGameDB(gameName, playerName, isHost, uid), this.addActiveGameToPlayer(gameName, uid, isHost)]);
  }

  public addAPlayerToGame(gameName: string, playerName: string, isHost: boolean, uid: string): Promise<[void, void]> {
    return Promise.all([this.addAPlayerToGameDB(gameName, playerName, isHost, uid), this.addActiveGameToPlayer(gameName, uid, isHost)]);
  }

  public addAPlayerToGameDB(gameName: string, playerName: string, isHost: boolean, uid: string): Promise<void> {
    // TODO extract to model
    const updatePlayer: GamePlayer = {
      uid: uid,
      name: playerName,
      isHost: isHost,
      status: this.INITIAL_STATUS,
      // TODO update on all places to order by pos when fetching
      pos: this.random53()
      // substract to initial model object
    };
    // What if he joins again? Handle!
    return this.db
      .collection<GamePlayer>('games')
      .doc(gameName)
      .collection('players')
      .doc(uid)
      .set(updatePlayer);
  }

  public addCurrentUserAsFriendToOtherPlayer(targetUid: string, nameOfCurrentUser: string): Promise<void> {
    if (targetUid === this.afAuth.auth.currentUser.uid) {
      return Promise.reject(Error('Does not make sense to add yourself as friend.'));
    }
    return this.addFriendToUser(targetUid, this.afAuth.auth.currentUser.uid, nameOfCurrentUser);
  }

  public addFriendToCurrentUser(newFriendUid: string, name: string): Promise<void> {
    if (newFriendUid === this.afAuth.auth.currentUser.uid) {
      return Promise.reject('Does not make sense to add yourself as friend.');
    }
    return this.addFriendToUser(this.afAuth.auth.currentUser.uid, newFriendUid, name);
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

  public logToServer(error: any): void {
    const stacktrace = error.stack ? error.stack : error.toString();
    this.db.collection('errors')
      .doc(new Date().getTime().toString())
      .set({
        stacktrace: stacktrace
      });
  }

  public fetchNewHtmlVersionStatus(): Observable<any> {
    return this.db.collection('versions')
      .doc<number>('current').valueChanges();
  }

  private deleteActiveGameRef(gamePlayer: GamePlayer, gameName: string): Promise<any> {
    return this.db.collection('players')
      .doc(gamePlayer.uid)
      .collection('activegames')
      .doc(gameName)
      .delete();
  }

  private deleteGamePlayersRef(gamePlayer: GamePlayer, gameName: string): Promise<any> {
    return this.db.collection('games')
      .doc(gameName)
      .collection('players')
      .doc(gamePlayer.uid)
      .delete();
  }

  private getGameObject(gameName: string, language: LANGUAGE) {
    const STARTING_ROUND = 0;
    return {
      name: gameName,
      host: this.afAuth.auth.currentUser.uid,
      visibilityPrivate: true,
      status: 'gamelobby' as GameStatus,
      players: [],
      round: STARTING_ROUND,
      createdAt: Date.now(),
      language: language,
      pointsScored: {}
    };
  }

  private addActiveGameToPlayer(gameName: string, uid: string, isLoggedInPlayerHost: boolean): Promise<void> {
    const activeGameModel: ActivePlayerGame = {
      name: gameName,
      isActionRequired: true, // isLoggedInPlayerHost,
      since: new Date().getTime()
    };
    return this.db
      .collection<GamePlayer>('players')
      .doc(uid)
      .collection<ActivePlayerGame>('activegames')
      .doc(gameName)
      .set(activeGameModel);
  }

  private addFriendToUser(toUid: string, newFriendUid: string, name: string): Promise<void> {
    const request: PlayerFriendlist = ({
      uid: newFriendUid,
      name: name,
      isOnline: false,
      lastOnline: Date.now()
    });

    return this.db
      .collection<PlayerProfile>('players')
      .doc(toUid)
      .collection<PlayerFriendlist>('friendlist')
      .doc(newFriendUid)
      .set(request);
  }

  private random53(): number {
    return Math.floor(Number.MAX_SAFE_INTEGER * (2 * (Math.random() - 0.5)));
  }
}
