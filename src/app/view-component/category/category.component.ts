import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { HttpclientService } from 'src/app/services/httpclient.service';
import { SingletonService } from 'src/app/services/singleton.service';
import { UserService } from 'src/app/services/user.service';
import { ALL_CATOGORIES } from 'src/app/typing/constant';
import { ICategories } from 'src/app/typing/interfaces';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit {
  constructor(
    private ss: SingletonService,
    private http: HttpclientService,
    private user: UserService,
    private router: Router
  ) {}

  get activeRole(): string {
    let role = this.user.getItem('role');
    return !role ? 'user' : role;
  }

  get routePrefix(): string {
    return this.activeRole;
  }
  ngOnInit(): void {
    this.getCatogories();
    // this.getallUsers();
  }
  availableCategories: Array<ICategories> = [];
  toast() {
    this.ss.message?.showStatusBar('login failed', 1000, 'fail');
  }

  nevigateRoute(item: ICategories) {
    console.log('-------', item);
    this.ss.manuallyRouteChangeSubject.next(item.title);
    this.router.navigateByUrl(this.routePrefix + '/' + item.title, {
      state: { target: item.title },
    });
  }

  getCatogories() {
    const url = 'categories';
    this.http.request('GET', url).subscribe((res) => {
      console.log(res);
      if (res.status === 200) {
        res.body.uniqueCategories.forEach((element) => {
          const categories = ALL_CATOGORIES.filter((category) => {
            return category.title.toLowerCase() === element.toLowerCase();
          });
          this.availableCategories.push(...categories);
        });
      }
      console.log('###', this.availableCategories);
    });
  }

  getallUsers() {
    const url = 'users';
    this.http.request('GET', url).subscribe((res) => {
      console.log(res);
      if (res.status === 200) {
        res.body.categories.forEach((element) => {
          console.log('###', element);
        });
      }
    });
  }
}
