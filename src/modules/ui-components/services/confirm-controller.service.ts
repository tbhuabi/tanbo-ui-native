import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmConfig {
    title: string;
    content: string;
}

@Injectable()
export class ConfirmController {
    confirmAction$: Observable<boolean>;
    confirmConfig$: Observable<ConfirmConfig>;
    confirmActionSource = new Subject<boolean>();
    private confirmConfigSource = new Subject<ConfirmConfig>();

    constructor() {
        this.confirmAction$ = this.confirmActionSource.asObservable();
        this.confirmConfig$ = this.confirmConfigSource.asObservable();
    }

    show(params: ConfirmConfig): Promise<any> {
        this.confirmConfigSource.next(params);
        return new Promise((resolve, reject) => {
            const sub = this.confirmAction$.subscribe((result: boolean) => {
                result ? resolve(result) : reject(result);
                sub.unsubscribe();
            });
        });
    }
}