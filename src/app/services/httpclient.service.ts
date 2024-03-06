import {
  HttpClient,
  HttpErrorResponse,
  HttpEvent,
  HttpEventType,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, filter, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { SingletonService } from './singleton.service';
export interface AuthResponceData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
export interface authHttpExtras {
  BaseUrl?: string;
  loader?: boolean;
  progress?: boolean;
  responseType?: 'json' | 'blob' | 'text';
}
@Injectable({
  providedIn: 'root',
})
export class HttpclientService {
  data = {};
  cleaTimeOut: any;
  isLoading = new BehaviorSubject<boolean>(false);
  IsloggedIn = new BehaviorSubject<boolean | null>(null);
  baseUrl$: string = environment.BASE_URL;
  // methode for fetching the sidebar menu
  getmenu(role: any): Observable<any> {
    return this.http.get(`../../../assets/menu/${role}.json`);
  }
  // methodes to show loader

  Show() {
    this.isLoading.next(true);
  }

  // methode to hide loader

  hide() {
    this.isLoading.next(false);
  }

  // sending the post request for login

  constructor(private http: HttpClient, private ss: SingletonService) {}

  // sending the get request to fetch the data

  // making the generic http common http service for all http backend communication
  request(
    methode: 'GET' | 'POST' | 'PUT' | 'DELETE',
    url: string,
    body?: any,
    params?: HttpParams | string | '',
    headers?: HttpHeaders | object,
    _options: authHttpExtras = {}
  ) {
    const DefaultOptions: authHttpExtras = {
      BaseUrl: this.baseUrl$,
      loader: true,
      progress: false,
      responseType: 'json',
    };
    //parsing the params
    let processedparams: HttpParams;
    if (typeof params === 'string') {
      processedparams = new HttpParams();
      if (params != '') {
        let splitparamsPair = params.split('&');
        _.forEach(splitparamsPair, (val) => {
          let splitparams = val.split('=');
          processedparams = processedparams.append(
            splitparams[0],
            splitparams[1]
          );
        });
      }
    } else if (params instanceof HttpParams) {
      processedparams = params;
    } else {
      processedparams = new HttpParams();
    }
    // parsing the header
    let processheader: HttpHeaders;
    if (headers instanceof Object) {
      if (headers instanceof HttpHeaders) {
        processheader = headers;
      } else {
        _.forEach(headers, (key, value) => {
          processheader = new HttpHeaders();
          processheader = processheader.append(key, value);
        });
      }
    } else {
      processheader = new HttpHeaders();
    }
    let modifiedOtion: authHttpExtras = _.assign(DefaultOptions, {});

    const request = this.http.request(
      // new HttpRequest(methode, modifiedOtion.BaseUrl + url, body, {
      new HttpRequest(methode, DefaultOptions.BaseUrl + url, body, {
        params: processedparams,
        reportProgress: false,
        headers: processheader,
        responseType: modifiedOtion?.responseType,
      })
    );

    return request.pipe(
      filter((event: any) => {
        switch (event.type) {
          case HttpEventType.Sent:
            return false;
          case HttpEventType.Response:
            return true;
          default:
            return false;
        }
      }),
      catchError((err) => {
        console.log('event type...', err);
        return [err];
      })
    );
  }
}
