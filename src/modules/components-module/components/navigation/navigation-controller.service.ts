import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NavController {
    pushEvent$: Observable<any>;
    popEvent$: Observable<any>;

    private params: { [key: string]: any };
    private pushEventSource = new Subject<any>();
    private popEventSource = new Subject<any>();

    constructor() {
        this.pushEvent$ = this.pushEventSource.asObservable();
        this.popEvent$ = this.popEventSource.asObservable();
    }

    push(component: any, params?: { [key: string]: any }) {
        this.params = params;
        this.pushEventSource.next(component);
    }

    pop() {
        this.popEventSource.next();
    }

    getParam(key: string) {
        if (this.params) {
            return this.params[key];
        }
    }
}