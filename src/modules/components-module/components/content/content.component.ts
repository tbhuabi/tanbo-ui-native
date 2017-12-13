import { Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Easing } from '@tweenjs/tween.js';

import { UI_ROUTER_ANIMATION_STEPS } from '../../config';
import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';
import { RouterService } from '../router/router.service';

@Component({
    selector: 'ui-content',
    templateUrl: './content.component.html'
})
export class ContentComponent implements OnDestroy, OnInit {
    @HostBinding('style.transform')
    translate: string;
    @HostBinding('style.opacity')
    opacity: number;
    private sub: Subscription;
    private state: ViewState = ViewState.Activate;

    constructor(private viewStateService: ViewStateService,
                private elementRef: ElementRef,
                private routerService: RouterService,
                private renderer: Renderer2,
                @Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number) {
    }

    ngOnInit() {
        const steps = this.steps;
        this.sub = this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
            const progress = Easing.Cubic.Out(status.progress / steps);

            switch (status.state) {
                case ViewState.Activate:
                    this.state = status.state;
                    this.translate = `translate3d(${100 - progress * 100}%, 0, 0)`;
                    break;
                case ViewState.Destroy:
                    this.state = status.state;
                    this.translate = `translate3d(${progress * 100}%, 0, 0)`;
                    break;
                case ViewState.ToStack:
                    this.state = status.state;
                    this.translate = `translate3d(${progress * 100 / -2}%, 0, 0)`;
                    this.opacity = 1 - 0.1 * status.progress / steps;
                    break;
                case ViewState.Reactivate:
                    this.state = status.state;
                    let n = -50 + progress * 100 / 2;
                    // 当dom元素的style有transform属性时，会导致子级元素 position: fixed 全屏失效
                    // 会跟着有定位的父级同样大小
                    this.translate = n === 0 ? '' : `translate3d(${n}%, 0, 0)`;
                    this.opacity = 0.9 + 0.1 * progress;
                    break;
                case ViewState.Moving:
                    if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
                        this.translate = `translate3d(${status.progress / steps * 100}%, 0, 0)`;
                    } else if (this.state === ViewState.ToStack) {
                        this.translate = `translate3d(${-50 + 50 * status.progress / steps}%, 0, 0)`;
                        this.opacity = 0.9 + 0.1 * status.progress / steps;
                    }
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('touchstart', ['$event'])
    touchStart(event: any) {
        const startPoint = event.touches[0];
        const startX = startPoint.pageX;
        const startY = startPoint.pageY;

        if (startX > 100 && this.state !== ViewState.Sleep) {
            return;
        }
        let unbindTouchMoveFn: () => void;
        let unbindTouchEndFn: () => void;
        let unbindFn: () => void;

        const maxWidth = this.elementRef.nativeElement.offsetWidth;
        const self = this;
        const startTime = Date.now();

        let isBack = false;
        let progress = 0;

        unbindTouchMoveFn = this.renderer.listen('document', 'touchmove', (event: any) => {
            const movePoint = event.touches[0];
            const moveX = movePoint.pageX;
            const moveY = movePoint.pageY;

            const distanceX = moveX - startX;
            const distanceY = moveY - startY;

            if (distanceX < distanceY && !isBack) {
                unbindFn();
                return;
            }

            isBack = true;
            progress = distanceX / maxWidth * this.steps;
            if (progress < 0) {
                progress = 0;
            } else if (progress > this.steps) {
                progress = this.steps;
            }
            this.routerService.publishMoveBackProgress(progress);
        });

        let diminishing = function () {
            progress--;
            if (progress < 0) {
                progress = 0;
                self.routerService.publishMoveBackProgress(progress);
                return;
            }
            self.routerService.publishMoveBackProgress(progress);
            requestAnimationFrame(diminishing);
        };

        let increasing = function () {
            progress++;
            if (progress > this.steps) {
                progress = this.steps;
                self.routerService.publishMoveBackProgress(progress);
                return;
            }
            self.routerService.publishMoveBackProgress(progress);
            requestAnimationFrame(increasing);
        }.bind(this);

        unbindFn = function () {

            unbindTouchMoveFn();
            unbindTouchEndFn();
            if (progress === 0) {
                return;
            }

            const endTime = Date.now();
            if (endTime - startTime < 100 && progress > this.steps * 0.2) {
                requestAnimationFrame(increasing);
                return;
            }
            if (progress < this.steps * 0.4) {
                requestAnimationFrame(diminishing);
            } else {
                requestAnimationFrame(increasing);
            }
        }.bind(this);

        unbindTouchEndFn = this.renderer.listen('document', 'touchend', unbindFn);
    }
}