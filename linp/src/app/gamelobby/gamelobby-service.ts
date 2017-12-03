import {AngularFirestore} from 'angularfire2/firestore';
import {GamePlayer} from '../models/game';
import {Injectable} from '@angular/core';

@Injectable()
export class GamelobbyService {

  constructor(private db: AngularFirestore) {

  }

  public fetchPlayerProfileName(uid: string): Promise<string> {
    return this.db.collection('players')
      .doc(uid)
      .valueChanges()
      .first()
      .toPromise()
      .then(playerProfile => {
          return (<GamePlayer>playerProfile).name;
        }
      );
  }
}
