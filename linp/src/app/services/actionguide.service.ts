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
  public actionDone: EventEmitter<Actionguidestatus>;

  constructor(private firebasegameService: FirebaseGameService) {
    this.actionDone = new EventEmitter();
  }

  public triggerActionDone(actionguideDto: ActionguideDto) {
    const authUid = this.firebasegameService.getAuthUid();

    const isCurrentGamePlayerIsHost = actionguideDto.gamePlayers.some(gamePlayer => {
      return gamePlayer.isHost && gamePlayer.uid === authUid;
    });
    const isFirstPlayer = actionguideDto.gamePlayers[0].uid === authUid;

    const rules: any = {
      gamelobby: (gamePlayers: GamePlayer[]): Actionguidestatus => {
        const isContinue = isCurrentGamePlayerIsHost && isFirstPlayer;
        return isContinue ? 'CONTINUE_ACTION' : 'WAITING';
      },
      firsttip: (gamePlayers) => {

      }
    };
    const actionGuideStatus: Actionguidestatus = rules[actionguideDto.gameStatus](actionguideDto.gamePlayers);
    this.actionDone.emit(actionGuideStatus);
  }
}
