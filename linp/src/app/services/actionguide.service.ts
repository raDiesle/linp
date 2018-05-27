import {EventEmitter, Injectable} from '@angular/core';
import {GamePlayer} from '../models/game';

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
