import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum ViewState {
    Init = 'Init',
    ToStack = 'ToStack',
    Destroy = 'Destroy'
}

@Injectable()
export class ViewStateService {
    initState: ViewState;
    state$: Observable<ViewState>;
    destroyEvent$: Observable<void>;
    private stateSource = new Subject<ViewState>();
    private destroyEventSource = new Subject<void>();

    constructor() {
        this.state$ = this.stateSource.asObservable();
        this.destroyEvent$ = this.destroyEventSource.asObservable();
    }

    publish(state: ViewState) {
        this.stateSource.next(state);
    }

    destroy() {
        this.destroyEventSource.next();
    }
}