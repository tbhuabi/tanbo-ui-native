import { Injectable, InjectionToken } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum ViewState {
    Activate = 'Activate',
    ToStack = 'ToStack',
    Destroy = 'Destroy',
    Reactivate = 'Reactivate',
    Sleep = 'Sleep',
    Moving = 'Moving'
}

export const UI_VIEW_INIT_STATE = new InjectionToken<ViewState>('UI_VIEW_INIT_STATE');

export const UI_VIEW_INIT_TOUCH_BACK = new InjectionToken<boolean>('UI_VIEW_INIT_TOUCH_BACK');

@Injectable()
export class ViewStateService {
    state: Observable<ViewState>;
    progress: Observable<number>;
    touchProgress: Observable<number>;

    private stateSource = new Subject<ViewState>();
    private progressSource = new Subject<number>();
    private touchEvent = new Subject<number>();

    constructor() {
        this.state = this.stateSource.asObservable();
        this.progress = this.progressSource.asObservable();
        this.touchProgress = this.touchEvent.asObservable();
    }

    changeState(state: ViewState) {
        this.stateSource.next(state);
    }

    updateProgress(n: number) {
        this.progressSource.next(n);
    }

    touching(progress: number) {
        this.touchEvent.next(progress);
    }
}