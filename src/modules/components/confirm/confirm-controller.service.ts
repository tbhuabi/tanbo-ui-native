import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface ConfirmConfig {
    title: string;
    content: string;
    btnsText?: Array<string>;
}

@Injectable()
export class ConfirmController {
    confirmConfig$: Observable<ConfirmConfig>;
    private confirmAction$: Observable<boolean>;
    private confirmActionSource = new Subject<boolean>();
    private confirmConfigSource = new Subject<ConfirmConfig>();

    constructor() {
        this.confirmAction$ = this.confirmActionSource.asObservable();
        this.confirmConfig$ = this.confirmConfigSource.asObservable();
    }

    show(params: ConfirmConfig): Promise<any> {
        this.confirmConfigSource.next(params);
        return new Promise((resolve) => {
            const sub = this.confirmAction$.subscribe((result: boolean) => {
                resolve(result);
                sub.unsubscribe();
            });
        });
    }

    publishAction(result: boolean) {
        this.confirmActionSource.next(result);
    }
}