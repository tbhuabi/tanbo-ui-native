import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export interface ViewConfig {
    component: any;
    params?: any;
}

@Injectable()
export class PageTransferStationService {
    component$: Observable<ViewConfig>;
    private componentSource = new Subject<ViewConfig>();

    constructor() {
        this.component$ = this.componentSource.asObservable();
    }

    push(obj: ViewConfig) {
        this.componentSource.next(obj);
    }
}
