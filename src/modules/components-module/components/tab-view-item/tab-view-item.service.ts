import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class TabViewItemService {
    activateState: Observable<boolean>;

    private changeEvent = new Subject<boolean>();

    constructor() {
        this.activateState = this.changeEvent.asObservable();
    }

    change(state: boolean) {
        this.changeEvent.next(state);
    }
}