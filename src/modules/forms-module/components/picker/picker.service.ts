import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class PickerService {
    onShow: Observable<void>;

    private showSource = new Subject<void>();

    constructor() {
        this.onShow = this.showSource.asObservable();
    }

    show() {
        this.showSource.next();
    }
}