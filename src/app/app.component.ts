import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SingletonService } from './services/singleton.service';
import { HttpclientService } from './services/httpclient.service';
import { UserService } from './services/user.service';
import { StatusMessageComponent } from './shared/statusMessage/status-message.component';
import { SubSink } from 'subsink';
import { Router } from '@angular/router';
import { SocketService } from './services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent
  implements OnInit, AfterViewInit, AfterContentChecked
{
  title = 'shopingcart';
  isOpen: boolean = false;
  private subs = new SubSink();
  @ViewChild(StatusMessageComponent) message!: StatusMessageComponent;
  constructor(
    public dialog: MatDialog,
    private ss: SingletonService,
    private user: UserService,
    private route: Router,
    private socket: SocketService,
    private cdRef: ChangeDetectorRef
  ) {}
  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }
  get routePrefix(): string {
    return this.user.getUserRole();
  }
  showLoader: boolean = false;
  ngOnInit(): void {
    this.subs.sink = this.ss.siddebarToggled$.subscribe((data) => {
      this.ss.isToggled = data;
      this.isOpen = this.ss.isToggled;
    });
    this.subs.sink = this.ss.loaderEnabled$.subscribe((res) => {
      this.showLoader = res;
    });
    // this.socket.initWebsocketEvent();
  }
  ngAfterViewInit() {
    this.user.autoLogout();
    const activerole = this.user.getItem('role');
    this.ss.isLogin$.next(!!activerole);
    this.ss.message = this.message;
    if (!activerole) {
      this.route.navigateByUrl('/user');
    } else {
      this.route.navigateByUrl(activerole);
    }
  }
  OnDesstroy() {
    this.subs.unsubscribe();
  }
}
