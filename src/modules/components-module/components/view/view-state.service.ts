import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum ViewState {
    Activate = 'Activate',
    ToStack = 'ToStack',
    Destroy = 'Destroy',
    Reactivate = 'Reactivate',
    Sleep = 'Sleep',
    Moving = 'Moving'
}

export interface ViewAnimationStatus {
    state: ViewState;
    progress: number;
}

@Injectable()
export class ViewStateService {
    state$: Observable<ViewAnimationStatus>;
    private stateSource = new Subject<ViewAnimationStatus>();

    constructor() {
        this.state$ = this.stateSource.asObservable();
    }

    publish(state: ViewAnimationStatus) {
        this.stateSource.next(state);
    }
}