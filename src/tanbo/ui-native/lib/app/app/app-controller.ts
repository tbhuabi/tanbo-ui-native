import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BrowserENV } from '../helper';

@Injectable()
export class AppController {
  onQuit: Observable<void>;
  onResize: Observable<BrowserENV>;
  transition: Observable<boolean>;
  private quitEvent = new Subject<void>();
  private resizeEvent = new Subject<BrowserENV>();
  private transitionEvent = new Subject<boolean>();

  constructor() {
    this.onQuit = this.quitEvent.asObservable();
    this.onResize = this.resizeEvent.asObservable();
    this.transition = this.transitionEvent.asObservable();
  }

  quit() {
    this.quitEvent.next();
  }

  resize(env: BrowserENV) {
    this.resizeEvent.next(env);
  }

  transitionStart() {
    this.transitionEvent.next(true);
  }

  transitionEnd() {
    this.transitionEvent.next(false);
  }
}

export function getDeviceType(): BrowserENV {
  const u = navigator.userAgent;
  // android终端
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
  // ios终端
  const isIOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(u);

  if (isAndroid) {
    return BrowserENV.android;
  }
  if (isIOS) {
    const screen = window.screen;
    if (screen.width === 375 && screen.height === 812 || screen.height === 375 && screen.width === 812) {
      return BrowserENV.iphoneX;
    }
    return BrowserENV.iphone;
  }
  return BrowserENV.default;
}