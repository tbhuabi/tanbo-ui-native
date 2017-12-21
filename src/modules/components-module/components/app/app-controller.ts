import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { BrowserENV } from '../../config';

@Injectable()
export class AppController {
    onQuit$: Observable<void>;
    onResize$: Observable<BrowserENV>;
    private quitEvent = new Subject<void>();
    private resizeEvent = new Subject<BrowserENV>();

    constructor() {
        this.onQuit$ = this.quitEvent.asObservable();
        this.onResize$ = this.resizeEvent.asObservable();
    }

    quit() {
        this.quitEvent.next();
    }

    resize(env: BrowserENV) {
        this.resizeEvent.next(env);
    }
}

export function getENV(): BrowserENV {
    const u = navigator.userAgent;
    // android终端
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
    // ios终端
    const isIOS = /\(i[^;]+;( U;)? CPU.+Mac OS X/.test(u);

    if (isAndroid) {
        return BrowserENV.android;
    }
    if (isIOS) {
        if (window.screen.width === 375 && window.screen.height === 812) {
            return BrowserENV.iphoneX;
        }
        return BrowserENV.iphone;
    }
    return BrowserENV.default;
}