import { ElementRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ListEventService {
    listOptions$: Observable<ElementRef>;

    private listOptionsSource = new Subject<ElementRef>();

    constructor() {
        this.listOptions$ = this.listOptionsSource.asObservable();
    }

    addOption(elementRef: ElementRef) {
        this.listOptionsSource.next(elementRef);
    }
}