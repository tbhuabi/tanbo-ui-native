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
    private distance: number = 0;

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
        if (this.distance === 0) {
            this.dragSource.next(0);
            return;
        }
        this.timer = setTimeout(() => {
            this.animationTo(0);
        }, 1000);
    }

    drag(n: number) {
        clearTimeout(this.timer);
        cancelAnimationFrame(this.animationId);
        this.distance = n;
        if (this.distance < 0) {
            this.distance = 0;
        }
        this.dragSource.next(this.distance);
    }

    dragEnd() {
        if (this.distance < this.doRefreshDistance) {
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
        const oldDistance = this.distance;
        const interval = target - oldDistance;
        if (interval === 0) {
            return;
        }
        const max = 20;
        let step = 0;
        const animationFn = () => {
            step++;
            this.distance = Easing.Cubic.Out(step / max) * interval + oldDistance;
            this.dragSource.next(this.distance);

            if (step < max) {
                this.animationId = requestAnimationFrame(animationFn);
            } else {
                if (callback) callback();
            }

        };

        this.animationId = requestAnimationFrame(animationFn);
    }
}