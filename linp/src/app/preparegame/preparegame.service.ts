import {Observable} from 'rxjs/Observable';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Game, GamePlayer, GamePlayerStatus, GameStatus} from '../models/game';
import {Injectable} from '@angular/core';
import {AngularFirestore} from 'angularfire2/firestore';

@Injectable()
export class PreparegameService {

  constructor(private db: AngularFirestore,
              private httpClient: HttpClient) {
  }

  public getRolesNeeded(gamePlayerSize: number) {

    const notSupporedModel = {
      wordsNeeded: 0,
      questionMarksNeeded: 0
    };

    const ruleSet = {
      4: {
        wordsNeeded: 4 / 2,
        questionMarksNeeded: 1
      },
      5: {
        wordsNeeded: 4 / 2,
        questionMarksNeeded: 1
      },
      6: {
        wordsNeeded: 4 / 2,
        questionMarksNeeded: 2
      },
      7: {
        wordsNeeded: 6 / 2,
        questionMarksNeeded: 1
      },
      8: {
        wordsNeeded: 6 / 2,
        questionMarksNeeded: 2
      }
    };

    return ruleSet[gamePlayerSize] ? ruleSet[gamePlayerSize] : notSupporedModel;
  }

  public assignWordOnServerside(gameName: string): Observable<any> {
    const statusToCheck = 'STARTED';
    const cloudFunctionsDomain = 'https://us-central1-linp-c679b.cloudfunctions.net';
    const cloudFunction = '/wordRoleAssignment';
    const url = cloudFunctionsDomain + cloudFunction;
    return this.httpClient
      .get(url,
        {
          // headers: headers,
          params: new HttpParams()
            .set('status', statusToCheck)
            .set('gameName', gameName)
        });
  }

  public updateGameStatusToNextPage(gameName: string) {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .update(<{ [status: string]: GameStatus }> {status: 'firsttip'});
  }

  public updateGamePlayerStatusReady(authUser: string, gameName: string) {
    return this.db
      .collection<Game>('games')
      .doc(gameName)
      .collection('players')
      .doc(authUser)
      .update(<{ [status: string]: GamePlayerStatus }> {status: 'READY_TO_START'});
  }
}
