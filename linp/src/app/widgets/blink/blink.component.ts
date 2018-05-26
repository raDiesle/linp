import {Component, HostBinding, OnDestroy, OnInit} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/takeWhile';
import 'rxjs/add/operator/mapTo';

@Component({
  selector: 'app-blink',
  template: `<ng-content></ng-content>`
})
export class BlinkComponent implements OnInit, OnDestroy {
  private blinker$: Observable<string>;
  private active: boolean = true;

  @HostBinding('style.visibility')
  private visibility: string;

  constructor() {
    const show$ = Observable.timer(0, 1000);
    const hide$ = Observable.timer(750, 1000);

    this.blinker$ = Observable.merge(
      show$.mapTo('visible'),
      hide$.mapTo('hidden')
    );
  }

  ngOnInit() {
    this.blinker$
      .takeWhile(() => this.active)
      .subscribe((newVisiblity: string) => this.visibility = newVisiblity);
  }

  ngOnDestroy() {
    this.active = false;
  }

}
