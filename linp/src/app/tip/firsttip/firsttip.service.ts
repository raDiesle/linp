import * as firebase from 'firebase';
import {AngularFirestore} from 'angularfire2/firestore';
import {Game, GameStatus} from '../../models/game';
import {Injectable} from '@angular/core';

@Injectable()
export class FirsttipService {

  constructor(public db: AngularFirestore) {
  }

  public sendSynonym(FIRST_SYNONYM_GIVEN_PLAYER_STATUS: string, synonym: string, gameName: string, authUser: firebase.User): Promise<void> {
    const gamePlayerUpdate = {
      status: FIRST_SYNONYM_GIVEN_PLAYER_STATUS,
      firstSynonym: synonym
    };
    return this.db.collection('games')
      .doc(gameName)
      .collection('players')
      .doc(authUser.uid)
      .update(gamePlayerUpdate)
  }

  public updateGameStatusToNextPage(gameName: string, nextPositiveRoute: string) {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .update(<{ [status: string]: GameStatus }> {status: nextPositiveRoute});
  }
}
