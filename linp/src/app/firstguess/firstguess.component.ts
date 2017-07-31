import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {GamePlayer} from "../models/game";
import {AngularFireAuth} from "angularfire2/auth";

interface Player {
  name: string;
}

@Component({
  selector: 'app-firstguess',
  templateUrl: './firstguess.component.html',
  styleUrls: ['./firstguess.component.css']
})
export class FirstguessComponent implements OnInit {
  gamename: any;
  dots: string;

  selectedPlayers: Player[] = [];

  players = [];

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {
    let sourceLoading = Observable
      .interval(500)
      .timeInterval();
    sourceLoading.subscribe((counter) => {
      const dotSymbolList = [" ", ".", "..", "...", "...."];
      this.dots = dotSymbolList[counter.value % dotSymbolList.length];
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnInit() {
    this.gamename = this.route.snapshot.paramMap.get("gamename");

    let pathOrRef = "/games/" + this.gamename + "/players";
    let firebaseListObservable: FirebaseListObservable<GamePlayer[]> = this.db.list(pathOrRef);
    let dbPlayers = firebaseListObservable.subscribe(data => {
      this.players = data;
    });

    firebaseListObservable
      .every(player => player.status === "FIRST_WORD_GIVEN")
      .subscribe(allGivenFirstSynonym => {
          if (allGivenFirstSynonym) {
            this.router.navigate(["/firstguess", this.gamename])
          }
        }
      );
  }

  onSelect(player): void {
    let wasSelectedBefore = this.selectedPlayers.indexOf(player) === -1;
    if (wasSelectedBefore) {
      if (this.selectedPlayers.length >= 2) {
        return;
      }
      this.selectedPlayers.push(player);
    } else {
      this.selectedPlayers.splice(this.selectedPlayers.indexOf(player), 1);
    }
  }

}
