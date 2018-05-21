import { Component, OnInit } from '@angular/core';
import { FirebaseGameService } from '../../services/firebasegame.service';

@Component({
  selector: 'app-shortdescription',
  templateUrl: './shortdescription.component.html',
  styleUrls: ['./shortdescription.component.scss']
})
export class ShortdescriptionComponent implements OnInit {

  public showShortDescription = false;

  constructor(private firebaseGameService: FirebaseGameService) { }

  ngOnInit() {
    this.firebaseGameService.observeLoggedInPlayerProfile()
      .subscribe(gameProfile => {
        if (gameProfile !== null && gameProfile.uistates !== undefined) {
          this.showShortDescription = gameProfile.uistates.showShortDescription;
        } else {
          this.showShortDescription = true;
        }
      });
  }

  public closeShortDescription(): void {
    if (this.firebaseGameService.isLoggedIn()) {
      this.showShortDescription = false;
      return;
    } else {
      this.firebaseGameService.updatePlayerUiState({
        'uistates.showShortDescription': false
      });
    }
  }

}
