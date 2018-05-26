import {EventEmitter, Injectable} from '@angular/core';
import {GamePlayer, GameStatus} from '../models/game';
import {FirebaseGameService} from './firebasegame.service';

@Injectable()
export class ActionguideService {
  public actionDone: EventEmitter<void>;

  constructor() {
    this.actionDone = new EventEmitter();
  }

  public triggerActionDone() {
    this.actionDone.emit();
  }
}
