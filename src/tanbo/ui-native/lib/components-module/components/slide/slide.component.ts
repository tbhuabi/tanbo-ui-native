import {
    Component,
    ContentChildren,
    QueryList,
    AfterViewInit,
    Input,
    OnDestroy,
    ElementRef,
    HostListener,
    Renderer2
} from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Easing } from '@tweenjs/tween.js';

import { AppController } from '../app/app-controller';
import { SlideItemComponent } from '../slide-item/slide-item.component';

@Component({
    selector: 'ui-slide',
    templateUrl: './slide.component.html'
})
export class SlideComponent implements AfterViewInit, OnDestroy {
    @ContentChildren(SlideItemComponent)
    items: QueryList<SlideItemComponent>;
    @Input()
    initIndex: number = 0;
    @Input()
    speed: number = 2000;
    @Input()
    steps: number = 35;

    get index(): number {
        return Math.ceil(this.progress - 0.5) % this.items.length;
    }

    private progress: number = 0;
    private timer: any = null;
    private animateId: number;
    private containerWidth: number;
    private subs: Subscription[] = [];

    constructor(private elementRef: ElementRef,
                private renderer: Renderer2,
                private appController: AppController) {
    }

    ngAfterViewInit() {
        this.progress = this.initIndex;
        this.containerWidth = this.elementRef.nativeElement.offsetWidth;
        this.subs.push(this.appController.onResize.subscribe(() => {
            this.containerWidth = this.elementRef.nativeElement.offsetWidth;
        }));
        setTimeout(() => {
            this.updateChildrenStyle(0);
            this.play();
        });
        this.subs.push(this.items.changes.pipe(delay(0)).subscribe(() => {
            this.updateChildrenStyle(0);
            this.play();
        }));
    }

    ngOnDestroy() {
        clearTimeout(this.timer);
        this.subs.forEach(item => item.unsubscribe());
    }

    @HostListener('touchstart', ['$event'])
    touchStart(event: any) {
        clearTimeout(this.timer);
        cancelAnimationFrame(this.animateId);
        if (this.items.length < 2) {
            return;
        }
        const element = this.elementRef.nativeElement;
        this.containerWidth = element.offsetWidth;
        const startX = event.touches[0].pageX;
        const len = this.items.length;

        let moveX: number;

        const startTime: number = Date.now();
        let entTime: number;

        let unTouchMoveFn: () => void;
        let unTouchEndFn: () => void;
        let unTouchCancelFn: () => void;

        const oldProgress = this.progress;

        const autoUpdateStyle = () => {
            let min = 0;
            const max = 20;
            const p = this.progress;

            const offset = startX - moveX;
            let target: number;

            if (entTime - startTime < 200 && Math.abs(offset) > 80) {
                if (offset > 0) {
                    target = Math.floor(p) + 1;
                } else {
                    target = Math.floor(p);
                }
            } else {
                target = p % 1 > 0.5 ? Math.ceil(p) : Math.floor(p);
            }
            const distance = target - p;

            const updateStyle = () => {
                min++;
                if (min < max) {
                    this.animateId = requestAnimationFrame(updateStyle);
                } else {
                    this.play();
                }
                this.progress = (p + Easing.Cubic.Out(min / max) * distance) % len;
                this.updateChildrenStyle(this.progress);
            };
            this.animateId = requestAnimationFrame(updateStyle);
        };

        const unbindFn = (unBindEvent: any) => {
            entTime = Date.now();
            unTouchMoveFn();
            unTouchEndFn();
            unTouchCancelFn();
            unBindEvent.stopPropagation();
            autoUpdateStyle();
        };

        unTouchMoveFn = this.renderer.listen(element, 'touchmove', (moveEvent: any) => {
            moveX = moveEvent.touches[0].pageX;
            this.progress = oldProgress - (moveX - startX) / this.containerWidth;
            if (this.progress < 0) {
                this.progress += len;
            }
            this.updateChildrenStyle(this.progress);
            moveEvent.stopPropagation();
        });

        unTouchEndFn = this.renderer.listen(element, 'touchend', unbindFn);
        unTouchCancelFn = this.renderer.listen(element, 'touchcancel', unbindFn);

        event.stopPropagation();
    }

    play() {
        clearTimeout(this.timer);
        if (this.items.length < 2) {
            return;
        }
        this.timer = setTimeout(() => {
            this.animate();
        }, this.speed);
    }

    private animate() {
        const progress = this.progress;
        let i = 0;
        const animateFn = () => {
            i++;
            this.progress = (progress + Easing.Cubic.Out(i / this.steps)) % this.items.length;
            this.updateChildrenStyle(this.progress);
            if (i < this.steps) {
                this.animateId = requestAnimationFrame(animateFn);
            } else {
                this.play();
            }
        };
        this.animateId = requestAnimationFrame(animateFn);

    }

    private updateChildrenStyle(progress: number) {
        const currentIndex = Math.floor(progress);
        const p = progress % 1;
        const len = this.items.length;
        this.items.forEach((item: SlideItemComponent, index: number) => {
            if (index === currentIndex) {
                item.state = 'in';
                item.animateProgress = -p;
            } else if (index === (currentIndex + 1) % len) {
                item.state = 'out';
                item.animateProgress = -p + 1;
            } else {
                item.animateProgress = -1;
                item.state = '';
            }
        });
    }
}