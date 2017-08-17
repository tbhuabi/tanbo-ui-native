import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ListEventService {
    focusEvent$: Observable<boolean>;
    listOptions$: Observable<ElementRef>;

    private focusEventSource = new Subject<boolean>();
    private listOptionsSource = new Subject<ElementRef>();

    constructor() {
        this.focusEvent$ = this.focusEventSource.asObservable();
        this.listOptions$ = this.listOptionsSource.asObservable();
    }

    publishEvent(state: boolean) {
        this.focusEventSource.next(state);
    }

    addOption(elementRef: ElementRef) {
        this.listOptionsSource.next(elementRef);
    }
}