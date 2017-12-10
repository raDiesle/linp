import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-waitingdots',
  templateUrl: './waitingdots.component.html',
  styleUrls: ['./waitingdots.component.css']
})
export class WaitingdotsComponent implements OnInit {

  dots = '&nbsp;&nbsp;&nbsp;&nbsp;';

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    Observable
      .interval(500)
      .timeInterval()
      .subscribe((counter) => {
        const dotSymbolList = ['&nbsp;&nbsp;&nbsp;&nbsp;', '.&nbsp;&nbsp;&nbsp;', '..&nbsp;&nbsp;', '...&nbsp;', '....'];
        this.dots = dotSymbolList[counter.value % dotSymbolList.length];
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnInit() {
  }

}
