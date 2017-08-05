import {
  Component, OnChanges, Input,
  SimpleChanges
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';

@Component({
  selector: 'fade',
  animations: [
    trigger('isVisibleChanged', [
      state('true' , style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)'  })),
      transition('1 => 0', animate('200ms')),
      transition('0 => 1', animate('700ms'))
    ])
  ],
  templateUrl: './fade.component.html',
  styleUrls: ['./fade.component.css']
})
export class FadeComponent {
  @Input() isVisible : boolean = false;
}
