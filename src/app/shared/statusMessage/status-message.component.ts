import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
export interface StatusBarMessage {
  message: string;
  duration: number;
  show: boolean;
  timeStamp: number;
}

@Component({
  selector: 'app-status-message',
  templateUrl: './status-message.component.html',
  styleUrls: ['./status-message.component.scss'],
  animations: [
    trigger('visibilityChanged', [
      state('true', style({ height: '*' })),
      state('false', style({ height: '*' })),
      transition('*=>*', animate('200ms')),
    ]),
    trigger('notificationAnimation', [
      transition(':enter', [
        animate(
          '400ms cubic-bezier(0.215, 0.61, 0.355, 1)',
          keyframes([
            style({ transform: 'translate3d(100%, 0, 0)', offset: 0 }),
            style({ transform: 'translate3d(-25px, 0, 0)', offset: 0.6 }),
            style({ transform: 'translate3d(10px, 0, 0)', offset: 0.75 }),
            style({ transform: 'translate3d(-5px, 0, 0)', offset: 0.9 }),
            style({ transform: 'translate3d(0, 0, 0)', offset: 1 }),
          ])
        ),
      ]),
      transition(':leave', [
        animate(
          '400ms ease-in',
          keyframes([
            style({
              transform: 'translate3d(0px, 0, 0)',
              offset: 0,
              opacity: 1,
            }),
            style({
              transform: 'translate3d(-20px, 0, 0)',
              offset: 0.2,
              opacity: 0.8,
            }),
            style({ transform: 'translateX(100%)', offset: 1, opacity: 0.1 }),
          ])
        ),
      ]),
    ]),
  ],
})
export class StatusMessageComponent implements OnInit {
  constructor() {}

  @Input() messageQueue: Array<StatusBarMessage> = [];
  timeOutRef: any;
  @Input() status!: boolean;
  @Input() msgType!: 'success' | 'fail';
  ngOnInit(): void {}

  showStatusBar(message: string, duration = 500, type: 'success' | 'fail') {
    this.status = true;
    this.msgType = type;
    console.log(this.msgType);
    const messageObject: StatusBarMessage = {
      message: message,
      duration: duration,
      show: true,
      timeStamp: new Date().getTime() + duration,
    };
    this.messageQueue.push(messageObject);

    if (!this.timeOutRef) {
      this.initAndMonitorNotifications();
    }
  }

  initAndMonitorNotifications() {
    this.messageQueue?.forEach((message) => {
      if (message?.timeStamp < Date.now()) {
        message.show = false;
      }
    });

    this.timeOutRef = setTimeout(() => {
      if (this.removedAllExpiredNotification()) {
        this.initAndMonitorNotifications();
      } else {
        clearTimeout(this.timeOutRef);
        this.messageQueue = [];
        this.timeOutRef = null;
        this.status = false;
      }
    }, 500);
  }

  removedAllExpiredNotification() {
    let token = false;
    let indices: Array<number> = [];

    this.messageQueue?.forEach((message, index) => {
      if (message && message?.show === true) {
        token = true;
      } else {
        indices.push(index);
      }
    });

    indices.forEach((index) => {
      this.messageQueue.splice(index, 1);
    });

    return token;
  }
}
