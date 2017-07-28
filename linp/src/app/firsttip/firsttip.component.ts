import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {nextTick} from "q";

@Component({
  selector: 'app-firsttip',
  templateUrl: './firsttip.component.html',
  styleUrls: ['./firsttip.component.css']
})
export class FirsttipComponent implements OnInit {

  yourRoleWordAnimationPos: number = 0;
  yourRoleWordAnimation: string;
  dots: string = "";

  constructor(private changeDetectorRef: ChangeDetectorRef) {

    var yourWordAnimation = ["your", "word", "to", "explain", "is", "_"];
//TODO      var yourRoleAnimation = ["YOU", "ARE", "THE", "? QUESTIONMARK ?"];

    yourWordAnimation.push("'House'");
    let source = Observable
      .interval(500)
      .timeInterval()
      .take(yourWordAnimation.length);
    source.subscribe((listItem) => {
      this.yourRoleWordAnimation = yourWordAnimation[listItem.value];
      this.changeDetectorRef.markForCheck();
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
  }

}
