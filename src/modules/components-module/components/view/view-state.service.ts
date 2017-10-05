import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum ViewState {
    Activate = 'Activate',
    ToStack = 'ToStack',
    Destroy = 'Destroy',
    Reactivate = 'Reactivate',
    Sleep = 'Sleep'
}

export interface ViewAnimationStatus {
    state: ViewState;
    progress: number;
}

@Injectable()
export class ViewStateService {
    state$: Observable<ViewAnimationStatus>;
    destroyEvent$: Observable<void>;
    private destroyEventSource = new Subject<void>();
    private stateSource = new Subject<ViewAnimationStatus>();

    constructor() {
        this.destroyEvent$ = this.destroyEventSource.asObservable();
        this.state$ = this.stateSource.asObservable();
    }

    destroy() {
        this.destroyEventSource.next();
    }

    publish(state: ViewAnimationStatus) {
        this.stateSource.next(state);
    }
}