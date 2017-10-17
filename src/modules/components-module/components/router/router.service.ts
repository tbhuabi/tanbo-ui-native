import { ComponentRef, Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class RouterService {
    animationProgress$: Observable<number>;
    activated$: Observable<ComponentRef<any>>;
    private activatedSource = new Subject<ComponentRef<any>>();
    private animationProgressSource = new Subject<number>();

    constructor() {
        this.activated$ = this.activatedSource.asObservable();
        this.animationProgress$ = this.animationProgressSource.asObservable();
    }

    publish(activateView: ComponentRef<any>) {
        this.activatedSource.next(activateView);
    }

    publishAnimationProgress(progress: number) {
        this.animationProgressSource.next(progress);
    }
}