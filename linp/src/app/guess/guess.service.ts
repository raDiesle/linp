import {Injectable} from '@angular/core';
import {GamePlayer, GamePlayerStatus, TeamTip} from '../models/game';
import {AngularFirestore} from 'angularfire2/firestore';
import {FirebaseGameService} from '../services/firebasegame.service';

@Injectable()
export class GuessService {

  constructor(public db: AngularFirestore,
              private firebaseGameService: FirebaseGameService) {
  }

  // simplify
  public onTeamPlayerGuessSelected(selectedPlayers, clickedGamePlayer) {
    const isPlayerSelectedNew = selectedPlayers.indexOf(clickedGamePlayer) === -1;
    if (isPlayerSelectedNew) {
      const wasMaxPlayersForTeamSelectedAlready = selectedPlayers.length >= 2;
      if (wasMaxPlayersForTeamSelectedAlready) {
        return selectedPlayers;
      }
      selectedPlayers.push(clickedGamePlayer);
    } else {
      selectedPlayers.splice(selectedPlayers.indexOf(clickedGamePlayer), 1);
    }

    return selectedPlayers;
  }

  public saveTeamTip(gameName: string,
                     selectedGamePlayers: GamePlayer[],
                     tipDBkey: string,
                     gamePlayerStatus: GamePlayerStatus): Promise<any> {
    // move to model
    const requestModel = this.createGuessModel(selectedGamePlayers, tipDBkey);
    requestModel.status = gamePlayerStatus;
    return this.firebaseGameService.updateGamePlayer(requestModel, gameName);
  }

  private createGuessModel(selectedGamePlayers, tipDBkey): GamePlayer {
    const teamTip: TeamTip = {
      firstPartner: {
        uid: selectedGamePlayers[0].uid,
        name: selectedGamePlayers[0].name
      },
      secondPartner: {
        uid: selectedGamePlayers[1].uid,
        name: selectedGamePlayers[1].name
      }
    };
    const request = {};
    request[tipDBkey] = teamTip;
    return request;
  }

}
