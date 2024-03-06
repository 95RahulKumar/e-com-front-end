import { HttpParams } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounce } from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { SingletonService } from 'src/app/services/singleton.service';
import { UserService } from 'src/app/services/user.service';
import { messageTypeEnum } from 'src/app/typing/enum';
import { IProducts } from 'src/app/typing/interfaces';
import { SubSink } from 'subsink';
@Component({
  selector: 'app-itemlist',
  templateUrl: './itemlist.component.html',
  styleUrls: ['./itemlist.component.scss'],
})
export class ItemlistComponent implements OnInit, OnDestroy {
  allowedTarget: Array<string> = [
    'mobile',
    'offer',
    'fan',
    'printer',
    'ac',
    'laptop',
    'camera',
    'smartwatch',
    'mobile',
    'power-bank',
    'antivirus',
    'veg',
  ];
  itemLists: Array<IProducts> = [];
  serverResponse: boolean = false;
  target: string = '';
  constructor(
    private ss: SingletonService,
    private router: Router,
    private http: HttpclientService,
    private user: UserService
  ) {
    let target = this.router.getCurrentNavigation().extras?.state?.['target'];
    this.target = target;
    this.fetchItemList(target);
  }

  get activeRole(): string {
    let role = this.user.getItem('role');
    return !role ? 'user' : role;
  }

  get routePrefix(): string {
    return this.activeRole;
  }
  private subs = new SubSink();
  ngOnInit(): void {}
  async fetchItemList(target: string) {
    const validTarget = this.allowedTarget.includes(target);
    if (validTarget) {
      const url = 'products';
      let params = new HttpParams();
      params = params.append('category', target);
      const res = await this.http.request('GET', url, null, params).toPromise();
      this.serverResponse = true;
      if (res.status == 200) {
        console.log(res.body);
        this.itemLists = res?.body?.products;
        console.log('------', this.itemLists);
      } else if (res.status == 404) {
        this.ss.message.showStatusBar(res.error.message, 3000, 'fail');
      }
    } else {
      return;
    }
  }
  isTodayCreated(date: string) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() - 1); // Subtract one day from the current date
    const systemDate = new Date(currentDate.setHours(0, 0, 0, 0)).getTime();
    const productCreationDate = new Date(date).getTime();
    return systemDate <= productCreationDate ? true : false;
  }
  addToWishlist(e: Event) {
    e.stopPropagation();
    const token = this.user.getToken();
    if (!token) {
      this.ss
        .ConfirmMessage(
          'Information',
          `Please login to access the page`,
          messageTypeEnum.WARN
        )
        .subscribe((res) => {});
    } else {
      return;
    }
  }

  showProduct(item: any) {
    this.router.navigateByUrl(this.routePrefix + '/' + 'view-details', {
      state: { data: item, route: this.target },
    });
  }
  findLable(): string {
    return this.allowedTarget.find((target) => target == this.target);
  }
  ngOnDestroy() {
    this.subs.unsubscribe();
  }
}
