import {
    Component,
    OnInit,
    OnDestroy,
    HostBinding,
    Input,
    Inject,
    ViewChild,
    ElementRef,
    AfterViewInit
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Easing } from '@tweenjs/tween.js';

import { PullDownRefreshController, UI_DO_REFRESH_DISTANCE } from '../../controllers/pull-down-refresh-controller';

@Component({
    selector: 'ui-refresher',
    templateUrl: './refresher.component.html'
})
export class RefresherComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input()
    color: string = '#80848f';

    @ViewChild('canvas')
    canvas: ElementRef;

    @HostBinding('style.height')
    get height() {
        return this.progress + 'px';
    }

    opacity: number = 1;

    progress: number = 0;
    isLoaded: boolean = false;

    private subs: Array<Subscription> = [];

    private canvasElement: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private containerWidth: number;

    private animationId: number;

    constructor(private pullDownRefreshController: PullDownRefreshController,
                @Inject(UI_DO_REFRESH_DISTANCE) private doRefreshDistance: number) {
    }

    ngOnInit() {
        this.subs.push(this.pullDownRefreshController.onStateChange.subscribe(n => {
            cancelAnimationFrame(this.animationId);
            this.progress = n;
            if (this.isLoaded && n < this.doRefreshDistance) {
                this.outStage();
                if (n === 0) {
                    this.isLoaded = false;
                }
            } else {
                this.opacity = 1;
                this.inStage();
            }
        }));

        this.subs.push(this.pullDownRefreshController.onRefresh.subscribe(() => {
            this.animateYoYo();
        }));
        this.subs.push(this.pullDownRefreshController.onRefreshEnd.subscribe(() => {
            this.opacity = 0.5;
            this.isLoaded = true;
        }));
    }

    ngAfterViewInit() {
        this.canvasElement = this.canvas.nativeElement;
        this.containerWidth = this.canvasElement.offsetWidth;
        this.canvasElement.width = this.containerWidth * 2;
        this.context = this.canvasElement.getContext('2d');
    }

    ngOnDestroy() {
        this.subs.forEach(item => item.unsubscribe());
        cancelAnimationFrame(this.animationId);
    }

    inStage() {
        if (!this.canvasElement) {
            return;
        }
        this.canvasElement.height = this.progress * 2;
        this.context.translate(this.containerWidth, this.progress);
        this.drawProgress(this.progress);
    }

    outStage() {
        if (!this.canvasElement) {
            return;
        }
        this.canvasElement.height = this.progress * 2;
        const context = this.context;
        context.translate(this.containerWidth, this.progress);
        context.clearRect(-this.containerWidth, -this.progress, this.containerWidth * 2, this.progress * 2);
        context.fillStyle = this.color;
        let r = this.doRefreshDistance - this.progress;
        context.arc(0, 0, r * 10, 0, Math.PI * 2);
        context.fill();

        this.opacity = Easing.Cubic.Out(this.progress / this.doRefreshDistance) / 2;
    }

    animateYoYo() {
        let progress: number = this.progress;

        const max = this.doRefreshDistance;

        const yoyo = () => {
            progress += 2;

            const isSingle: boolean = Math.floor(progress / max) % 2 === 1;
            let result: number;
            if (isSingle) {
                result = max - progress % max;
            } else {
                result = progress % max;
            }
            this.drawProgress(Easing.Cubic.In(result / max) * max);
            if (this.isLoaded && result === this.doRefreshDistance) {
                return;
            }
            this.animationId = requestAnimationFrame(yoyo);
        };

        this.animationId = requestAnimationFrame(yoyo);
    }

    drawProgress(progress: number) {
        const context = this.context;
        context.clearRect(-this.containerWidth, -this.progress, this.containerWidth * 2, this.progress * 2);

        this.context.fillStyle = this.color;
        let r1 = this.progress / 4;
        let r2 = this.progress / 5;

        if (r1 > 12) {
            r1 = 12;
        }
        if (r2 > 8) {
            r2 = 8;
        }

        context.beginPath();
        context.arc(0, 0, r1, 0, Math.PI * 2);
        context.closePath();
        context.fill();

        let distance = (this.doRefreshDistance - progress ) / this.doRefreshDistance * 40;
        context.beginPath();
        context.arc(-distance, 0, r2, 0, Math.PI * 2);
        context.closePath();
        context.fill();

        context.beginPath();
        context.arc(distance, 0, r2, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }
}