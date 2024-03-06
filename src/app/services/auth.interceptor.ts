import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, delay, finalize } from 'rxjs';
import { SingletonService } from './singleton.service';
import { UserService } from './user.service';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private ss: SingletonService,
    private user: UserService,
    private cookie: CookieService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    this.ss.loaderEnabled$.next(true);
    const token = this.user.getToken();
    if (token) {
      // If we have a token, we set it to the header
      request = request.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
      });
      return next.handle(request).pipe(
        delay(500),
        finalize(() => this.ss.loaderEnabled$.next(false))
      );
    }

    return next.handle(request).pipe(
      delay(500),
      finalize(() => this.ss.loaderEnabled$.next(false))
    );
  }
}
