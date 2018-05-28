import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Router} from '@angular/router';
import {LANGUAGE} from '../models/context';
import {FirebaseGameService} from '../services/firebasegame.service';

@Component({
  selector: 'app-creategame',
  templateUrl: './creategame.component.html',
  styleUrls: ['./creategame.component.css']
})
export class CreategameComponent implements OnInit, OnDestroy {

  gameName = '';
  public language: LANGUAGE = 'en';
  private ngUnsubscribe: Subject<void> = new Subject<void>();
  private playerName: string;

  constructor(
    public router: Router,
    public firebaseGameService: FirebaseGameService) {
  }

  ngOnInit() {
    this.firebaseGameService.observeLoggedInPlayerProfile()
      .takeUntil(this.ngUnsubscribe)
      .subscribe(playerProfile => {
        this.playerName = playerProfile.name;
        this.gameName = this.playerName;
      });
  }

  createGameAction(): void {
    this.firebaseGameService.writeGame(this.gameName, this.language)
      .then(() => {
        this.router.navigate(['gamelobby', this.gameName], {skipLocationChange: true});
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
