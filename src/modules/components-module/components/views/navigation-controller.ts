import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { PageTransition, AnimationType } from './animation-type';

export interface ViewConfig {
    component: any;
    transition: PageTransition;
}

@Injectable()
export class NavController {
    pushEvent$: Observable<ViewConfig>;
    popEvent$: Observable<any>;

    private params: { [key: string]: any };
    private pushEventSource = new Subject<ViewConfig>();
    private popEventSource = new Subject<any>();

    constructor() {
        this.pushEvent$ = this.pushEventSource.asObservable();
        this.popEvent$ = this.popEventSource.asObservable();
    }

    push(component: any, params?: { [key: string]: any }, transition: PageTransition = {
        activate: AnimationType.SlideInRight,
        reactivate: AnimationType.FadeInLeft,
        destroy: AnimationType.SlideOutRight,
        toStack: AnimationType.FadeOutLeft
    }) {
        this.params = params;
        this.pushEventSource.next({
            component,
            transition
        });
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