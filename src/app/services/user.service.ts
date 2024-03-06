import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { HttpclientService } from './httpclient.service';
import { SingletonService } from './singleton.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(
    private cookie: CookieService,
    private ss: SingletonService,
    private http: HttpclientService,
    private route: Router
  ) {}

  setItem(key: string, value: string) {
    localStorage.setItem(key, value);
  }
  removeItem(key: string) {
    localStorage.removeItem(key);
  }
  getItem(key: string) {
    return localStorage.getItem(key);
  }
  getToken() {
    return this.getItem('token');
  }

  getUserName(): string {
    return this.decodeToken()?.['name'];
  }
  decodeToken() {
    const token: any = this.getToken();
    if (token) {
      return JSON.parse(atob(token.split('.')[1]));
    } else {
      return;
    }
  }

  getUserRole(): string {
    return this.decodeToken()?.['role'];
  }

  userLogout() {
    const url = 'logout';
    this.http.request('GET', url).subscribe((res) => {
      if (res.status === 200) {
        this.ss.message.showStatusBar(res.body.message, 3000, 'success');
      } else if (res.status === 500) {
        this.ss.message.showStatusBar('Internal Server Error', 3000, 'fail');
      }
    });
    this.removeItem('token');
    this.removeItem('role');
    this.ss.isLogin$.next(false);
    const activerole = this.getItem('role');
    if (!activerole) {
      this.route.navigateByUrl('/user');
    } else {
      this.route.navigateByUrl(activerole);
    }
    // this.route.navigateByUrl('/');
  }

  autoLogout() {
    const exp = this.decodeToken()?.['exp'];
    const currentTime = Date.now();
    const expTime = exp * 1000;
    if (currentTime > expTime) {
      this.userLogout();
    }
  }
}
