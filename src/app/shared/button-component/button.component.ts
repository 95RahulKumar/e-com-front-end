import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnInit {
  constructor() {}
  @Input() isBtnDisabled: boolean = false;
  @Input() color: string;
  @Input() size: string;
  @Input() btntype: string = 'button';
  @Input() isInverted: boolean = false;
  ngOnInit(): void {}
}
