import {Component, EventEmitter, Input, Output} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-fade',
  animations: [
    trigger('isVisibleChanged', [
      state('true', style({opacity: 1, transform: 'scale(1.0)'})),
      state('false', style({opacity: 0, transform: 'scale(0.0)'})),
      transition('1 => 0', animate('200ms')),
      transition('0 => 1', animate('700ms'))
    ])
  ],
  templateUrl: './fade.component.html',
  styleUrls: ['./fade.component.css']
})
export class FadeComponent {

  @Output()
  isVisibleChange = new EventEmitter();
  public isVisibleInternal = false;

  @Input()
  out;

  @Input()
  get isVisible() {
    return this.isVisibleInternal;
  }

  set isVisible(isVisible) {
    this.isVisibleInternal = isVisible;
    if (this.out !== true) {
      return;
    }
    setTimeout(() => {
      this.isVisibleInternal = false;
      this.isVisibleChange.emit(this.isVisibleInternal);
    }, 1500);
  }
}
