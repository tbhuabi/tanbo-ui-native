import { Inject, Injectable, InjectionToken } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Easing } from '@tweenjs/tween.js';

export const UI_DO_REFRESH_DISTANCE = new InjectionToken<number>('UI_DO_REFRESH_DISTANCE');

@Injectable()
export class PullDownRefreshController {
    onStateChange: Observable<number>;
    onDragEnd: Observable<void>;
    onRefresh: Observable<void>;
    onRefreshEnd: Observable<void>;

    private dragSource = new Subject<number>();
    private dragEndSource = new Subject<void>();
    private refreshSource = new Subject<void>();
    private refreshEndSource = new Subject<void>();
    private oldDistance: number = 0;
    private newDistance: number = 0;

    private animationId: number;
    private timer: any = null;

    constructor(@Inject(UI_DO_REFRESH_DISTANCE) private doRefreshDistance: number) {
        this.onStateChange = this.dragSource.asObservable();
        this.onDragEnd = this.dragEndSource.asObservable();
        this.onRefresh = this.refreshSource.asObservable();
        this.onRefreshEnd = this.refreshEndSource.asObservable();
    }

    refreshEnd() {
        this.refreshEndSource.next();
        this.timer = setTimeout(() => {
            this.animationTo(0);
        }, 1000);
    }

    drag(n: number) {
        clearTimeout(this.timer);
        cancelAnimationFrame(this.animationId);
        this.newDistance = n + this.oldDistance;
        if (this.newDistance < 0) {
            this.newDistance = 0;
        }
        this.dragSource.next(this.newDistance);
    }

    dragEnd() {
        this.oldDistance = this.newDistance;
        if (this.oldDistance < this.doRefreshDistance) {
            this.animationTo(0);
        } else {
            this.refresh();
        }

        this.dragEndSource.next();
    }

    refresh() {
        cancelAnimationFrame(this.animationId);
        this.animationTo(this.doRefreshDistance, () => {
            this.refreshSource.next();
        });
    }

    private animationTo(target: number, callback?: () => void) {
        const max = 20;
        let step = 0;

        const oldDistance = this.oldDistance;

        const interval = target - oldDistance;

        const animationFn = () => {
            step++;
            const newDistance = Easing.Cubic.Out(step / max) * interval + oldDistance;
            this.oldDistance = newDistance;
            this.dragSource.next(newDistance);

            if (step < max) {
                this.animationId = requestAnimationFrame(animationFn);
            } else {
                if (callback) callback();
            }

        };

        this.animationId = requestAnimationFrame(animationFn);
    }
}