import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum ViewState {
    Activate = 'Activate',
    ToStack = 'ToStack',
    Destroy = 'Destroy',
    Reactivate = 'Reactivate',
    Sleep = 'Sleep'
}

@Injectable()
export class ViewStateService {
    destroyEvent$: Observable<void>;
    popoverState$: Observable<boolean>;
    private destroyEventSource = new Subject<void>();
    private popoverStateSource = new Subject<boolean>();

    constructor() {
        this.destroyEvent$ = this.destroyEventSource.asObservable();
        this.popoverState$ = this.popoverStateSource.asObservable();
    }

    destroy() {
        this.destroyEventSource.next();
    }

    isShowPopover(state: boolean) {
        this.popoverStateSource.next(state);
    }
}