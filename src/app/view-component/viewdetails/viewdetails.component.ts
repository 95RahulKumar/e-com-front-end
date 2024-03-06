import { Component, OnInit } from '@angular/core';
import { SingletonService } from 'src/app/services/singleton.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { messageTypeEnum } from 'src/app/typing/enum';
@Component({
  selector: 'app-viewdetails',
  templateUrl: './viewdetails.component.html',
  styleUrls: ['./viewdetails.component.scss'],
})
export class ViewdetailsComponent implements OnInit {
  viewObject: any;
  currentRoute: string;
  constructor(
    private ss: SingletonService,
    public location: Location,
    private router: Router,
    private user: UserService
  ) {
    this.viewObject =
      this.router.getCurrentNavigation().extras?.state?.['data'];
    this.currentRoute =
      this.router.getCurrentNavigation().extras?.state?.['route'];
  }

  ngOnInit(): void {
    this.ss.isDetailPage.next(true);
    console.log('====', this.viewObject);
  }

  get activeRole(): string {
    let role = this.user.getItem('role');
    return !role ? 'user' : role;
  }

  get routePrefix(): string {
    return this.activeRole;
  }

  goBack() {
    this.location.back();
    this.ss.manuallyRouteChangeSubject.next(this.currentRoute);
  }

  showModelPopup(img: string) {
    console.log('showModelPopup', img);
  }

  addToCartBtn() {
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
      this.router.navigateByUrl(this.routePrefix + '/' + 'cart', {
        state: { data: this.viewObject },
      });
    }
  }

  buyNowBtn() {
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

  writeReviews() {
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
}
