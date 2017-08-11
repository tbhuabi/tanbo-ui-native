import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class RadioStateService {
    state$: Observable<void>;

    private stateSource = new Subject<void>();

    constructor() {
        this.state$ = this.stateSource.asObservable();
    }

    publishEvent() {
        this.stateSource.next();
    }
}