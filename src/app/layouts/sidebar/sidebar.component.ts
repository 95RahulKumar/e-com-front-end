import {
  AfterContentChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { expandCollapse, rotateToggle } from 'src/app/animation/animation';
import { menuInterface } from 'src/app/typing/interfaces';
import { SingletonService } from 'src/app/services/singleton.service';
import { messageTypeEnum } from 'src/app/typing/enum';
import { menuBar } from 'src/app/typing/constant';
import { UserService } from 'src/app/services/user.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription, debounceTime, first } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [expandCollapse, rotateToggle],
})
export class SidebarComponent
  implements OnInit, OnDestroy, AfterContentChecked
{
  constructor(
    private ss: SingletonService,
    private user: UserService,
    private cdRef: ChangeDetectorRef,
    private httpclient: HttpClient
  ) {}

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }
  roles = new Map([
    ['admin', 'admin'],
    ['user', 'user'],
  ]);
  private subs = new SubSink();
  Menu!: Array<menuInterface>;
  fetchedSidebar: Array<menuInterface>;
  isOpend: boolean = false;
  // isActiveInLocal: boolean = false;
  isLogin: boolean = false;
  get loggedInUser(): string {
    return this.user.getUserName();
  }
  get activeRole(): string {
    let role = this.user.getItem('role');
    return !role ? 'user' : role;
  }
  get routePrefix(): string {
    return this.activeRole;
  }
  ngOnInit() {
    this.subs.sink = this.ss.isLogin$
      .pipe(debounceTime(300))
      .subscribe((result) => {
        this.isLogin = result;
        console.log('---------------', result);
        const role = this.activeRole;
        this.fetchingSidebarJson(role)
          .then((res) => {
            if (role === 'admin') {
              this.Menu = res;
            }
            if (role === 'user') {
              this.Menu = this.getSideBar(res);
            }
          })
          .catch((error) => {
            console.log('Error fetching sidebar:', error);
          });
      });

    //doing subscription when cliked on any link on category page
    this.subs.sink = this.ss.manuallyRouteChangeSubject.subscribe((res) => {
      let activemenu = this.Menu.find((menu) => {
        return menu?.submenu?.find((item) => item?.link == res);
      });
      activemenu.isActive = true;
    });

    this.subs.sink = this.ss.isDetailPage.subscribe((res) => {
      if (res) {
        this.Menu.map((menu) => {
          menu.isActive = false;
        });
      }
    });
  }

  sideToggle() {
    this.isOpend = !this.isOpend;
    this.setToggleState();
  }
  setToggleState() {
    this.ss.siddebarToggled$.next(this.isOpend);
  }

  //new function to add active item for only one item at a time(which have submenu)(main logic)
  toggleSlide(index: number) {
    this.Menu.forEach((item, i) => {
      return (item.isActive = i === index ? !item.isActive : false);
    });
  }
  ///////

  fetchingSidebarJson(role: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.httpclient
        .request('GET', `assets/sidebar/${role}.json`)
        .subscribe((res) => {
          if (res) {
            resolve(res);
          } else {
            reject([]);
          }
        });
    });
  }

  login(menuItem: string, e: Event) {
    if (menuItem == 'Login') {
      e.preventDefault();
      this.subs.sink = this.ss
        .LoginBox('', 'Are you sure want to proceed?', messageTypeEnum.WARN)
        .subscribe((res) => console.log('dialog data...', res));
    } else {
      return;
    }
  }

  getSideBar(menu: Array<menuInterface>): Array<menuInterface> {
    const regex1 = /\bmy\w*/;
    const regex2 = /\bLogin\w*/;
    let filteredMenu: Array<menuInterface>;
    switch (this.isLogin) {
      case false:
        filteredMenu = menu.filter((item) => {
          return regex1.test(item?.text) != true;
        });
        break;
      case true:
        filteredMenu = menu.filter((item) => {
          return regex2.test(item?.text) != true;
        });
        break;
      default:
        filteredMenu = menu.filter((item) => {
          return regex1.test(item?.text) != true;
        });
    }
    return filteredMenu;
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
