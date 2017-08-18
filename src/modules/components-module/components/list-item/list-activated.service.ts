import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ListActivatedService {
    activatedComponent$: Observable<void>;

    private activatedComponentSource = new Subject<void>();

    constructor() {
        this.activatedComponent$ = this.activatedComponentSource.asObservable();
    }

    publish() {
        this.activatedComponentSource.next();
    }
}