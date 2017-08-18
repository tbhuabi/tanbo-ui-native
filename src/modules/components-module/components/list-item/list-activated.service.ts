import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ListActivatedService {
    activatedComponent$: Observable<any>;

    private activatedComponentSource = new Subject<any>();

    constructor() {
        this.activatedComponent$ = this.activatedComponentSource.asObservable();
    }

    publish(component: any) {
        this.activatedComponentSource.next(component);
    }
}