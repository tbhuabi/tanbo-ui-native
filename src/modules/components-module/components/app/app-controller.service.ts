import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class AppController {
    onQuit$: Observable<void>;
    hasHistory$: Observable<boolean>;
    private quitSource = new Subject<void>();
    private hasHistorySource = new Subject<boolean>();

    constructor() {
        this.onQuit$ = this.quitSource.asObservable();
        this.hasHistory$ = this.hasHistorySource.asObservable();
    }

    quit() {
        this.quitSource.next();
    }

    hasHistory(x: boolean) {
        this.hasHistorySource.next(x);
    }
}