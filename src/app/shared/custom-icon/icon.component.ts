import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'svg-icon',
  styleUrls: ['./icon.component.scss'],
  template: `<svg [style.width.px]="w" [style.height.px]="h">
    <use #icon attr.xlink:href="assets/icon-sprite.svg#{{ symbol }}"></use>
  </svg>`,
})
export class IconComponent implements OnInit, AfterViewInit {
  @ViewChild('icon', { static: true }) icon!: ElementRef;
  @Input() symbol!: string;
  @Input() w: string = '24';
  @Input() h: string = '24';
  constructor(private renderer: Renderer2) {}

  ngOnInit(): void {}
  ngAfterViewInit(): void {
    console.log(this.icon.nativeElement);
    console.log(this.w);
    this.renderer.setStyle(this.icon.nativeElement, 'Width', '24px');
  }
}
