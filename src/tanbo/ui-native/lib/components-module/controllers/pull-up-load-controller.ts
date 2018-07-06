import { Injectable, InjectionToken } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export const UI_DO_LOAD_DISTANCE = new InjectionToken<number>('UI_DO_LOAD_DISTANCE');

@Injectable()
export class PullUpLoadController {
    onLoading: Observable<void>;
    onLoaded: Observable<void>;

    private infiniteSource = new Subject<void>();
    private loadedSource = new Subject<void>();

    private isPrevLoaded: boolean = true;

    constructor() {
        this.onLoading = this.infiniteSource.asObservable();
        this.onLoaded = this.loadedSource.asObservable();
    }

    loading() {
        if (this.isPrevLoaded) {
            this.isPrevLoaded = false;
            this.infiniteSource.next();
        }
    }

    loaded() {
        this.isPrevLoaded = true;
        this.loadedSource.next();
    }
}