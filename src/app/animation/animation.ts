import {
  trigger,
  state,
  style,
  transition,
  animate,
  query,
  stagger,
} from '@angular/animations';

export const fadeSlideInOut = trigger('fadeSlideInOut', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(-20px)' }),
    animate('200ms', style({ opacity: 1, transform: 'translateY(0)' })),
  ]),
  transition(':leave', [
    style({ opacity: 1, transform: 'translateY(0)' }),
    animate('200ms', style({ opacity: 0, transform: 'translateY(-20px)' })),
  ]),
]);
export const fadeIn = trigger('fadeIn', [
  state(
    'void',
    style({
      opacity: 0,
    })
  ),
  state(
    '*',
    style({
      opacity: 1,
    })
  ),
  transition(':enter, :leave', [animate('500ms ease-in-out')]),
]);

export const fadeOut = trigger('fadeOut', [
  state(
    'void',
    style({
      opacity: 0,
    })
  ),
  state(
    '*',
    style({
      opacity: 1,
    })
  ),
  transition(':enter', [style({ opacity: 0 }), animate('500ms ease-in-out')]),
  transition(':leave', [animate('500ms ease-in-out', style({ opacity: 0 }))]),
]);

export const expandCollapse = trigger('expandCollapse', [
  state('collapsed', style({ height: '0px', overflow: 'hidden', opacity: 0 })),
  state('expanded', style({ height: '*', overflow: 'visible', opacity: 1 })),
  transition('collapsed <=> expanded', [animate('200ms ease-in-out')]),
]);
export const rotateToggle = trigger('rotateToggle', [
  state(
    'expanded',
    style({ transform: 'rotate(45deg)', transformOrigin: 'center center' })
  ),
  state(
    'collapsed',
    style({ transform: 'rotate(0deg)', transformOrigin: 'center center' })
  ),
  transition('expanded <=> collapsed', animate('200ms ease-in')),
]);

export const detailExpand = trigger('detailExpand', [
  state('collapsed', style({ height: '0px', minHeight: '0' })),
  state('expanded', style({ height: '*' })),
  transition(
    'expanded <=> collapsed',
    animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
  ),
]);
// export const revelFromLeft = trigger('revelFromLeft', [
//   state(
//     'collapsed',
//     style({ transition: '0', overflow: 'hidden', opacity: 1 })
//   ),
//   state(
//     'expanded',
//     style({ transition: '230px', overflow: 'visible', opacity: 1 })
//   ),
//   transition('collapsed <=> expanded', [animate('100ms ease-out')]),
// ]);
