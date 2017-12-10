import {Component, OnInit} from '@angular/core';
import {FirebaseGameService} from "../services/firebasegame.service";
import {ActivatedRoute} from "@angular/router";
import {GamePlayer} from "../models/game";
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-finalizeround',
  templateUrl: './finalizeround.component.html',
  styleUrls: ['./finalizeround.component.scss']
})
export class FinalizeroundComponent implements OnInit {
  private gameName: string;
  private gamePlayers: GamePlayer[] = [];
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private route: ActivatedRoute,
              private firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.gameName = this.route.snapshot.paramMap.get('gamename');

    this.firebaseGameService.observeGamePlayers(this.gameName)
      .takeUntil(this.ngUnsubscribe)
      .subscribe(gamePlayers => {
        this.gamePlayers = gamePlayers;
      });
  }

}
