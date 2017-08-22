import { trigger, state, animate, transition, style, group } from '@angular/animations';

export const growShrinkStaticStart = trigger('growShrinkStaticStart', [
  state('in', style({width: 120, transform: 'translateX(0)', opacity: 1})),
  transition('void => *', [
    style({opacity: 0}),
    group([
      animate('0.3s 0.1s ease', style({
      })),
      animate('0.3s ease', style({
        opacity: 1
      }))
    ])
  ]),
  transition('* => void', [
    group([
      animate('0.3s ease', style({
      })),
      animate('0.3s 0.2s ease', style({
        opacity: 0
      }))
    ])
  ])
])
