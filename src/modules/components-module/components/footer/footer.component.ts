import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as TWEEN from '@tweenjs/tween.js';

import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnDestroy, OnInit {
    @HostBinding('style.transform')
    translate: string;
    @HostBinding('style.opacity')
    opacity: number;

    private sub: Subscription;
    private state: ViewState;

    constructor(private viewStateService: ViewStateService) {
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
}