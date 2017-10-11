import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class NavController {
    pushEvent$: Observable<any>;
    popEvent$: Observable<void>;
    quitEvent$: Observable<void>;
    destroyAction$: Observable<void>;
    moveBackProgress$: Observable<number>;

    private params: { [key: string]: any };
    private pushEventSource = new Subject<any>();
    private popEventSource = new Subject<void>();
    private quitEventSource = new Subject<void>();
    private destroyActionSource = new Subject<void>();
    private moveBackProgressSource = new Subject<number>();

    constructor() {
        this.pushEvent$ = this.pushEventSource.asObservable();
        this.popEvent$ = this.popEventSource.asObservable();
        this.quitEvent$ = this.quitEventSource.asObservable();
        this.destroyAction$ = this.destroyActionSource.asObservable();
        this.moveBackProgress$ = this.moveBackProgressSource.asObservable();
    }

    push(component: any, params?: { [key: string]: any }) {
        this.params = params;
        this.pushEventSource.next(component);
    }

    pop() {
        this.popEventSource.next();
    }

    destroy() {
        this.destroyActionSource.next();
    }

    publishMoveBackEvent(progress: number) {
        this.moveBackProgressSource.next(progress);
    }

    quit() {
        this.quitEventSource.next();
    }

    getParam(key: string) {
        if (this.params) {
            return this.params[key];
        }
    }
}