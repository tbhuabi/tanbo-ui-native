import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export enum NotifyType {
    Default,
    Primary,
    Info,
    Warning,
    Success,
    Danger
}

export interface NotifyConfig {
    content: string;
    autoHide?: boolean;
    type?: NotifyType;
    time?: number;
}

@Injectable()
export class NotifyController {
    notify$: Observable<NotifyConfig>;
    private notifySource = new Subject<NotifyConfig>();

    constructor() {
        this.notify$ = this.notifySource.asObservable();
    }

    push(config: NotifyConfig) {
        this.notifySource.next(config);
    }
}