import {Component, OnInit} from '@angular/core';
import {FirebaseGameService} from "../services/firebasegame.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-deletegame',
  templateUrl: './deletegame.component.html',
  styleUrls: ['./deletegame.component.scss']
})
export class DeletegameComponent implements OnInit {
  private isDeleted = false;

  constructor(private route: ActivatedRoute,
              firebaseGameService: FirebaseGameService) {
    const gameName = this.route.snapshot.paramMap.get('gamename');
    firebaseGameService.deleteGame(gameName)
      .then(() => {
        this.isDeleted = true;
      });
  }

  ngOnInit() {
  }

}
