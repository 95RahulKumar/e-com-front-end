import { Injectable } from '@angular/core';
import { Socket, io } from 'socket.io-client';
import { WebsocketEvent } from '../typing/web-socket-enum';
import { SingletonService } from './singleton.service';
import { ISocketMessage, ISocketReturnMsg } from '../typing/interfaces';
import { Subject } from 'rxjs/internal/Subject';
@Injectable({
  providedIn: 'root',
})
export class SocketService {
  socket: Socket;
  WebSocketMsgSubject: Subject<ISocketReturnMsg> = new Subject();
  WebSocketKeystrokSubject: Subject<string> = new Subject();
  constructor(private ss: SingletonService) {
    // this.initWebsocketEvent();
  }

  async initWebsocketEvent() {
    this.socket = await io(this.ss.socketUrl, {
      transports: ['websocket'], // Specify 'websocket' as the transport
    });
    // initializing the socket service...
    // this.socket.on(WebsocketEvent.CONNECT, () => {
    //   console.log('websocket connected successfully');
    //   this.recieveMsg();
    //   this.reciekeyStrok();
    // });
    // this.socket.on(WebsocketEvent.CONNECTERROR, (err) => {
    //   console.log(`connect_error due to ${err.message}`);
    //   this.socket.connect();
    // });
    // this.socket.on(WebsocketEvent.DISSCONNECT, (reason) => {
    //   console.log(`disconnect due to ${reason}`);
    // });
  }

  sendMessage(msg: ISocketMessage) {
    this.socket.emit(WebsocketEvent.MESSAGE, msg);
  }

  recieveMsg() {
    this.socket.on(WebsocketEvent.MESSAGE, (data) => {
      this.WebSocketMsgSubject.next(data);
    });
  }
  keyStroke(val: string) {
    this.socket.emit(WebsocketEvent.KEYSTOCK, val);
  }
  reciekeyStrok() {
    this.socket.on(WebsocketEvent.KEYSTOCK, (data) => {
      this.WebSocketKeystrokSubject.next(data);
    });
  }
}
