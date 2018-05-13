import { Injectable, EventEmitter } from '@angular/core';
import { GamePlayer, GameStatus } from '../models/game';
import { FirebaseGameService } from './firebasegame.service';

export interface ActionguideDto {
  gamePlayers: GamePlayer[];
  gameStatus: GameStatus;
}

export type Actionguidestatus = 'CONTINUE_ACTION' | 'WAITING';

@Injectable()
export class ActionguideService {
  public actionDone: EventEmitter<void>;

  constructor(private firebasegameService: FirebaseGameService) {
    this.actionDone = new EventEmitter();
  }

  public triggerActionDone() {
      this.actionDone.emit();
  }
}
