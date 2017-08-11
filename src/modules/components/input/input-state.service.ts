import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class InputStateService {
    state$: Observable<any>;

    private stateSource = new Subject<any>();

    constructor() {
        this.state$ = this.stateSource.asObservable();
    }

    publishState(state: any) {
        this.stateSource.next(state);
    }
}