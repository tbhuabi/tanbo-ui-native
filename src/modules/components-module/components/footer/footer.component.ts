import { Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CubicBezier } from 'tanbo-bezier';

import { UI_ROUTER_ANIMATION_STEPS } from '../../config';
import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnDestroy, OnInit {
    @HostBinding('style.transform')
    @HostBinding('style.webkitTransform')
    translate: string;
    @HostBinding('style.opacity')
    opacity: number;

    private sub: Subscription;
    private state: ViewState;

    constructor(private viewStateService: ViewStateService,
                @Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number) {
    }

    ngOnInit() {
        const steps = this.steps;
        const bezier = new CubicBezier(.36, .66, .04, 1);
        this.sub = this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
            const progress = bezier.update(status.progress / steps);
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
                    this.translate = `translate3d(${progress * -33}%, 0, 0)`;
                    this.opacity = 1 - 0.1 * status.progress / steps;
                    break;
                case ViewState.Reactivate:
                    this.state = status.state;
                    let n = -33 + progress * 33;
                    // 当dom元素的style有transform属性时，会导致子级元素 position: fixed 全屏失效
                    // 会跟着有定位的父级同样大小
                    this.translate = n === 0 ? '' : `translate3d(${n}%, 0, 0)`;
                    this.opacity = 0.9 + 0.1 * progress;
                    break;
                case ViewState.Moving:
                    if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
                        this.translate = `translate3d(${status.progress / steps * 100}%, 0, 0)`;
                    } else if (this.state === ViewState.ToStack) {
                        this.translate = `translate3d(${-33 + 33 * status.progress / steps}%, 0, 0)`;
                        this.opacity = 0.9 + 0.1 * status.progress / steps;
                    }
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}