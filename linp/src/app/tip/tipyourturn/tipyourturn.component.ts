import { Component, OnInit, Input } from '@angular/core';
import { GamePlayer, GamePlayerStatus, GameStatus } from 'app/models/game';
import { ActivatedRoute } from '@angular/router';
import { FirebaseGameService } from 'app/services/firebasegame.service';

@Component({
  selector: 'app-tipyourturn',
  templateUrl: './tipyourturn.component.html',
  styleUrls: ['./tipyourturn.component.scss']
})
export class TipyourturnComponent implements OnInit {

  @Input()
  public loggedInGamePlayer: GamePlayer;

  @Input()
  private isSecondtip: boolean;

  private gameName: GameStatus;

  public synonym: string;
  public savedResponseFlag = false;

  constructor(private route: ActivatedRoute,
    private firebaseGameService: FirebaseGameService) { }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename') as GameStatus;
  }

  public sendSynonym(): void {
    const firstNextPlayerStatus: GamePlayerStatus = 'FIRST_SYNONYM_GIVEN';
    const secondNextPlayerStatus: GamePlayerStatus = 'SECOND_SYNONYM_GIVEN';
    const nextPlayerStatus = this.isSecondtip ?   secondNextPlayerStatus : firstNextPlayerStatus;
    const firstOrSecondGamePlayerUpdate = {
      status: nextPlayerStatus
    };
    const currentSynonymTipKey = this.isSecondtip ? 'secondSynonym' : 'firstSynonym';
    firstOrSecondGamePlayerUpdate[currentSynonymTipKey] = this.synonym;

    this.firebaseGameService.sendSynonym(firstOrSecondGamePlayerUpdate, this.gameName)
      .then(() => {
        this.savedResponseFlag = true;
      });
  }
}
