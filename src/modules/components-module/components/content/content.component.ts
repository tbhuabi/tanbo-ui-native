import { Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import * as TWEEN from '@tweenjs/tween.js';

import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';
import { NavController } from '../navigation/navigation-controller.service';

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
    private state: ViewState = null;

    constructor(private viewStateService: ViewStateService,
                private elementRef: ElementRef,
                private navController: NavController,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        this.sub = this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
            const progress = TWEEN.Easing.Cubic.Out(status.progress / 100);

            switch (status.state) {
                case ViewState.Activate:
                    this.state = status.state;
                    this.translate = `translateX(${100 - progress * 100}%)`;
                    break;
                case ViewState.Destroy:
                    this.state = status.state;
                    this.translate = `translateX(${progress * 100}%)`;
                    break;
                case ViewState.ToStack:
                    this.state = status.state;
                    this.translate = `translateX(${progress * 100 / -2}%)`;
                    this.opacity = 1 - 0.1 * status.progress / 100;
                    break;
                case ViewState.Reactivate:
                    this.state = status.state;
                    let n = -50 + progress * 100 / 2;
                    // 当dom元素的style有transform属性时，会导致子级元素 position: fixed 全屏失效
                    // 会跟着有定位的父级同样大小
                    this.translate = n === 0 ? '' : `translateX(${n}%)`;
                    this.opacity = 0.9 + 0.1 * progress;
                    break;
                case ViewState.Moving:
                    if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
                        this.translate = `translateX(${status.progress}%)`;
                    } else if (this.state === ViewState.ToStack) {
                        this.translate = `translateX(${-50 + status.progress / 2}%)`;
                        this.opacity = 0.9 + 0.1 * status.progress / 100;
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

        if (startX > 100 && this.state !== null && this.state !== ViewState.Sleep) {
            return;
        }
        let unbindTouchMoveFn: () => void;
        let unbindTouchEndFn: () => void;
        let unbindFn: () => void;

        const maxWidth = this.elementRef.nativeElement.offsetWidth;
        const self = this;

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
            progress = distanceX / maxWidth * 100;
            if (progress < 0) {
                progress = 0;
            } else if (progress > 100) {
                progress = 100;
            }
            this.navController.publishMoveBackEvent(progress);
        });

        let diminishing = function () {
            progress -= 3;
            if (progress < 0) {
                progress = 0;
                self.navController.publishMoveBackEvent(progress);
                return;
            }
            self.navController.publishMoveBackEvent(progress);
            requestAnimationFrame(diminishing);
        };

        let increasing = function () {
            progress += 4;
            if (progress > 100) {
                progress = 100;
                self.navController.publishMoveBackEvent(progress);
                return;
            }
            self.navController.publishMoveBackEvent(progress);
            requestAnimationFrame(increasing);
        };

        unbindFn = function () {
            unbindTouchMoveFn();
            unbindTouchEndFn();
            if (progress === 0) {
                return;
            }

            if (progress < 40) {
                requestAnimationFrame(diminishing);
            } else {
                requestAnimationFrame(increasing);
            }
        };

        unbindTouchEndFn = this.renderer.listen('document', 'touchend', unbindFn);
    }
}