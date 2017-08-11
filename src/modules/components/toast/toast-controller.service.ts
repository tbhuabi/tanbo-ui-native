import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum ToastType {
    Default = 'default',
    Primary = 'primary',
    Info = 'info',
    Warning = 'warning',
    Success = 'success',
    Danger = 'danger'
}

export interface ToastConfig {
    content: string;
    type?: ToastType;
    time?: number;
}

@Injectable()
export class ToastController {
    notify$: Observable<ToastConfig>;
    private notifySource = new Subject<ToastConfig>();

    constructor() {
        this.notify$ = this.notifySource.asObservable();
    }

    push(config: ToastConfig) {
        this.notifySource.next(config);
    }
}