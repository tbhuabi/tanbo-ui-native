import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class AppController {
    onQuit$: Observable<void>;
    private quitEvent = new Subject<void>();

    constructor() {
        this.onQuit$ = this.quitEvent.asObservable();
    }

    quit() {
        this.quitEvent.next();
    }
}