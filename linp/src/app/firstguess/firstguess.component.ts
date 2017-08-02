import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";
import {ActivatedRoute, Router} from "@angular/router";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database";
import {GamePlayer} from "../models/game";
import {AngularFireAuth} from "angularfire2/auth";
import * as firebase from 'firebase/app';


@Component({
  selector: 'app-firstguess',
  templateUrl: './firstguess.component.html',
  styleUrls: ['./firstguess.component.css']
})
export class FirstguessComponent implements OnInit {
  user: firebase.User;
  gamename: any;
  dots: string;

  selectedPlayers: GamePlayer[] = [];

  players = [];
  private playersKeys: string[];

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              private router: Router,
              public db: AngularFireDatabase,
              public afAuth: AngularFireAuth) {

    afAuth.authState.subscribe(data => {
      this.user = data;
    });

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
    let dbPlayers = this.db.object(pathOrRef)
      .subscribe(data => {
        this.players = data;
        this.playersKeys = Object.keys(this.players);
      });
  }

  onSelect(player): void {
    let isPlayerSelectedNew = this.selectedPlayers.indexOf(player) === -1;
    if (isPlayerSelectedNew) {
      const wasMaxPlayersForTeamSelectedAlready = this.selectedPlayers.length >= 2;
      if (wasMaxPlayersForTeamSelectedAlready) {
        return;
      }
      this.selectedPlayers.push(player);
    } else {
      this.selectedPlayers.splice(this.selectedPlayers.indexOf(player), 1);
    }
  }

  onSave() : void{
    const path = "games/" + this.gamename + "/players/" + this.user.uid + "/firstTeamTip";
    let dbGames = this.db.database.ref(path);

    const firstTeamTip = {
      firstPartner : {
        uid : this.selectedPlayers[0].uid,
      },
      secondPartner : {
        uid : this.selectedPlayers[1].uid,
      }
    };

    dbGames.set(firstTeamTip);
  }

}
