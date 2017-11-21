import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class RouterPatchService {
    back$: Observable<any>;
    private backSource = new Subject<any>();

    constructor() {
        this.back$ = this.backSource.asObservable();
    }

    publish(arg: any) {
        this.backSource.next(arg);
    }
}