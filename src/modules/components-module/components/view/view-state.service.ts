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
    private destroyEventSource = new Subject<void>();

    constructor() {
        this.destroyEvent$ = this.destroyEventSource.asObservable();
    }

    destroy() {
        this.destroyEventSource.next();
    }
}