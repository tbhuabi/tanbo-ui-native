import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class ScrollService {
    onScroll: Observable<HTMLElement>;

    private scrollEvent = new Subject<HTMLElement>();

    constructor() {
        this.onScroll = this.scrollEvent.asObservable();
    }

    scroll(element: HTMLElement) {
        this.scrollEvent.next(element);
    }
}