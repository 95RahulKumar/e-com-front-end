import { Injectable, TemplateRef } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ConfirmationComponent } from '../shared/confirmation/confirmation.component';
import { messageTypeEnum } from '../typing/enum';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LogintempComponent } from '../shared/login-popup/logintemp.component';
import { StatusMessageComponent } from '../shared/statusMessage/status-message.component';
import { DialogComponent } from '../shared/dialog/dialog.component';
import { environment as env } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class SingletonService {
  constructor(public dialog: MatDialog) {}
  siddebarToggled$ = new Subject<boolean>();
  isToggled: boolean = false;
  loaderEnabled$ = new Subject<boolean>();
  manuallyRouteChangeSubject = new Subject<string>();
  // manuallyRouteBehaviourSubject = new behavi
  // sidebarRoteChangePath$ = new Subject<string>();
  isDetailPage = new Subject<boolean>();
  isLogin$ = new Subject<boolean>();
  role$ = new Subject<string>();
  message: StatusMessageComponent;
  socketUrl: string = env.webSocketUrl;
  //methode for open popup
  ConfirmMessage(
    title: string,
    message: string,
    type?: messageTypeEnum,
    tempalate?: TemplateRef<any>,
    className?: messageTypeEnum,
    hidebtn?: boolean
  ): Observable<ConfirmationComponent> {
    return this.dialog
      .open(ConfirmationComponent, {
        data: {
          title: title,
          message: message,
          type: type,
          template: tempalate,
          className: className,
          hidebtn: hidebtn,
        },
        minWidth: '400px',
        maxWidth: '450px',
        backdropClass: 'blur',
      })
      .afterClosed();
  }

  LoginBox(
    title: string,
    message?: string,
    type?: messageTypeEnum,
    tempalate?: TemplateRef<any>,
    className?: messageTypeEnum,
    hidebtn?: boolean
  ): Observable<LogintempComponent> {
    return this.dialog
      .open(LogintempComponent, {
        data: {
          title: title,
          message: message,
          type: type,
          template: tempalate,
          className: className,
          hidebtn: hidebtn,
        },
        backdropClass: 'blur',
        panelClass: 'reset-panel',
        maxWidth: '95vw',
      })
      .afterClosed();
  }

  DialogBox(
    title: string,
    message?: string,
    type?: messageTypeEnum,
    tempalate?: TemplateRef<any>,
    className?: messageTypeEnum,
    hidebtn: boolean = false
  ): MatDialogRef<DialogComponent> {
    return this.dialog.open(DialogComponent, {
      data: {
        title: title,
        message: message,
        type: type,
        template: tempalate,
        className: className,
        hidebtn: hidebtn,
      },
      backdropClass: 'blur',
      panelClass: 'reset-panel',
      maxWidth: '95vw',
    });
  }

  //methode for open popup
  GeneralPopup(
    title: string,
    message: string,
    type?: messageTypeEnum,
    tempalate?: TemplateRef<any>,
    className?: messageTypeEnum,
    hidebtn?: boolean
  ): Observable<ConfirmationComponent> {
    return this.dialog
      .open(ConfirmationComponent, {
        data: {
          title: title,
          message: message,
          type: type,
          template: tempalate,
          className: className,
          hidebtn: hidebtn,
        },
        backdropClass: 'blur',
        width: '90vw',
        minWidth: '300px',
        maxWidth: '400px',
      })
      .afterClosed();
  }
}
