import {EventEmitter, Injectable} from '@angular/core';
import {GamePlayer, GameStatus} from '../models/game';
import {FirebaseGameService} from './firebasegame.service';

@Injectable()
export class ActionguideService {
  public actionDone: EventEmitter<GamePlayer[]>;

  constructor() {
    this.actionDone = new EventEmitter();
  }

  public triggerActionDone(gamePlayers: GamePlayer[]) {
    this.actionDone.emit(gamePlayers);
  }
}
