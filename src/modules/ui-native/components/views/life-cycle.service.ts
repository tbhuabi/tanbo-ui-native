import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import { Event } from '../../utils/event';

@Injectable()
export class LifeCycleService {
    event$: Observable<Event>;
    private eventSource = new Subject<Event>();

    constructor() {
        this.event$ = this.eventSource.asObservable();
    }

    publishEvent(event: Event) {
        this.eventSource.next(event);
    }
}