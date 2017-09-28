import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ContentLoadingController {
    showLoading$: Observable<string>;
    hideLoading$: Observable<void>;
    private showLoadingSource = new Subject<string>();
    private hideLoadingSource = new Subject<void>();

    constructor() {
        this.showLoading$ = this.showLoadingSource.asObservable();
        this.hideLoading$ = this.hideLoadingSource.asObservable();
    }

    show(text?: string) {
        this.showLoadingSource.next(text);
    }

    hide() {
        this.hideLoadingSource.next();
    }
}