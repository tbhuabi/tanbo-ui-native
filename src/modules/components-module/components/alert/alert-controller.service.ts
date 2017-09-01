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
        // 当接收到用户事件时，发布相应事件，并返回 promise，当用户点击确定时，resolve 当前 promise;
        this.alertConfigSource.next(params);
        return new Promise((resolve) => {
            const sub = this.alertAction$.subscribe(() => {
                resolve();
                sub.unsubscribe();
            });
        });
    }

    publishAction() {
        // 发布用户点击弹出框的确认按扭事件
        this.alertActionSource.next();
    }
}