import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Component({
  selector: 'app-waitingdots',
  templateUrl: './waitingdots.component.html',
  styleUrls: ['./waitingdots.component.css']
})
export class WaitingdotsComponent implements OnInit {

  dots = '';

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    Observable
      .interval(500)
      .timeInterval()
      .subscribe((counter) => {
        const dotSymbolList = [' ', '.', '..', '...', '....'];
        this.dots = dotSymbolList[counter.value % dotSymbolList.length];
        this.changeDetectorRef.markForCheck();
      });
  }

  ngOnInit() {
  }

}
