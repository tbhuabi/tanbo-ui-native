import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class TabService {
    tabIndex$: Observable<number>;
    private tabIndexSource = new Subject<number>();

    constructor() {
        this.tabIndex$ = this.tabIndexSource.asObservable();
    }

    publishIndex(index: number) {
        this.tabIndexSource.next(index);
    }
}