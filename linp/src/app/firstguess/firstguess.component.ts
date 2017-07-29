import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from "rxjs/Observable";

interface Player{
  name :string;
}

const PLAYERS: any[] =
  [
    {
      name: "Peter"
    },
    {
      name: "Heinz"
    },
    {
      name: "David"
    },
    {
      name: "Lina"
    }];

@Component({
  selector: 'app-firstguess',
  templateUrl: './firstguess.component.html',
  styleUrls: ['./firstguess.component.css']
})
export class FirstguessComponent implements OnInit {
  dots: string;

  selectedPlayers: Player[] = [];

  players = PLAYERS;

  constructor(private changeDetectorRef : ChangeDetectorRef) {
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
  }

  onSelect(player) : void {
    let wasSelectedBefore = this.selectedPlayers.indexOf(player) === -1;
    if(wasSelectedBefore){
      if(this.selectedPlayers.length >= 2){
        return;
      }
      this.selectedPlayers.push(player);
    }else{
      this.selectedPlayers.splice(this.selectedPlayers.indexOf(player), 1);
    }
  }

}
