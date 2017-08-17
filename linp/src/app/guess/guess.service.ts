import {Injectable} from '@angular/core';

@Injectable()
export class GuessService {

  constructor() {
  }

  // simplify

  public onTeamPlayerGuessSelected(selectedPlayers, clickedGamePlayer) {
    const isPlayerSelectedNew = selectedPlayers.indexOf(clickedGamePlayer) === -1;
    if (isPlayerSelectedNew) {
      const wasMaxPlayersForTeamSelectedAlready = selectedPlayers.length >= 2;
      if (wasMaxPlayersForTeamSelectedAlready) {
        return;
      }
      selectedPlayers.push(clickedGamePlayer);
    } else {
      selectedPlayers.splice(selectedPlayers.indexOf(clickedGamePlayer), 1);
    }

    return selectedPlayers;

  }

}
