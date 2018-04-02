
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { HttpClient } from '@angular/common/http';
import { Game, GamePlayer, GamePlayerStatus, GameStatus, SynonymKey, ActivePlayerGames } from '../models/game';
import { Observable } from 'rxjs/Observable';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { PlayerProfile, PlayerFriendlist } from '../models/player';
import { LANGUAGE } from '../models/context';
import { ActivatedRoute } from '@angular/router';
import { DocumentReference } from '@firebase/firestore-types';

@Injectable()
export class FirebaseGameService {
  readonly INITIAL_STATUS = 'JOINED_GAME';
  public authUserUid: string;

  constructor(
    private afAuth: AngularFireAuth,
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

  public observePublicGamesToJoin(): Observable<Game[]> {
    return this.db.collection<Game>('games', (ref) => {
      return ref.where('status', '==', 'gamelobby');
    })
      .valueChanges()
  }

  public observeActivegamesOfPlayer(): Observable<ActivePlayerGames[]> {
    return this.db
      .collection<Game>('players')
      .doc(this.afAuth.auth.currentUser.uid)
      .collection<ActivePlayerGames>('activegames')
      .valueChanges()
  }

  public observeGames(): Observable<Game[]> {
    return this.db
      .collection<Game>('games')
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
    return this.db
      .collection('players')
      .doc(this.afAuth.auth.currentUser.uid)
      .valueChanges();
  }

  public observePlayerProfile(uid: string): Observable<PlayerProfile> {
    return this.db
      .collection<PlayerProfile>('players')
      .doc(uid)
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
      .update(<{ [status: string]: GameStatus }>{ status: newStatus });
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

  public addLoggedInPlayerToGame(gameName: string): Promise<[void, void]> {
    // TODO might be reduced to call
    return Promise.all([this.observeGame(gameName).first().toPromise(),
    this.observeLoggedInPlayerProfile().first().toPromise()])
      .then(responses => {
        const game = responses[0] as Game;
        // not needed
        const loggedInPlayerIsHost = this.afAuth.auth.currentUser.uid === game.host;
        const playerName = (<PlayerProfile>responses[1]).name;
        const gamePromise = this.addCurrentPlayerToGame(gameName, playerName, loggedInPlayerIsHost);
        const playerPromise = this.addActiveGameToPlayer(gameName);
        return Promise.all([gamePromise, playerPromise]);
      });
  }

  public addCurrentPlayerToGame(gameName: string, playerName: string, isHost: boolean): Promise<void> {
    const uid = this.afAuth.auth.currentUser.uid;
    return this.addAPlayerToGame(gameName, playerName, isHost, uid);
  }

  public addAPlayerToGame(gameName: string, playerName: string, isHost: boolean, uid: string): Promise<void> {
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

  private addActiveGameToPlayer(gameName: string): Promise<void> {
    const activeGameModel: ActivePlayerGames = {
      name: gameName
    };
    return this.db
      .collection<GamePlayer>('players')
      .doc(this.afAuth.auth.currentUser.uid)
      .collection<ActivePlayerGames>('activegames')
      .doc(gameName)
      .set(activeGameModel);
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

  // TODO
  public updatePlayerProfileIsOnline(isOnline: boolean): Promise<void> {
    return this.db.collection('players')
      .doc(this.authUserUid)
      .set({
        isOnline: isOnline
      }, { merge: true });
  }

  private random53(): number {
    return Math.floor(Number.MAX_SAFE_INTEGER * (2 * (Math.random() - 0.5)));
  }
}
