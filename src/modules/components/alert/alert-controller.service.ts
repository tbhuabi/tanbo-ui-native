import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface AlertConfig {
    title: string;
    content: string;
    btnText?: string;
}

@Injectable()
export class AlertController {
    alertConfig$: Observable<AlertConfig>;
    private alertAction$: Observable<void>;
    private alertActionSource = new Subject<void>();
    private alertConfigSource = new Subject<AlertConfig>();

    constructor() {
        this.alertAction$ = this.alertActionSource.asObservable();
        this.alertConfig$ = this.alertConfigSource.asObservable();
    }

    show(params: AlertConfig): Promise<any> {
        this.alertConfigSource.next(params);
        return new Promise((resolve) => {
            const sub = this.alertAction$.subscribe(() => {
                resolve();
                sub.unsubscribe();
            });
        });
    }

    publishAction() {
        this.alertActionSource.next();
    }
}