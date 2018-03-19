import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class PickerService {
    onShow: Observable<void>;
    onUpdate: Observable<void>;

    private showSource = new Subject<void>();
    private updateSource = new Subject<void>();

    constructor() {
        this.onShow = this.showSource.asObservable();
        this.onUpdate = this.updateSource.asObservable();
    }

    show() {
        this.showSource.next();
    }

    update() {
        this.updateSource.next();
    }
}