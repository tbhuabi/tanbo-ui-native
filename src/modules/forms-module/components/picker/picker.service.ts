import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class PickerService {
    onShow: Observable<void>;
    onScroll: Observable<boolean>;

    private showEvent = new Subject<void>();
    private scrollEvent = new Subject<boolean>();

    constructor() {
        this.onShow = this.showEvent.asObservable();
        this.onScroll = this.scrollEvent.asObservable();
    }

    show() {
        this.showEvent.next();
    }

    scroll(b: boolean) {
        this.scrollEvent.next(b);
    }
}