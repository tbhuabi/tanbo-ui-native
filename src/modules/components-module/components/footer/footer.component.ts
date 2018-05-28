import { Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CubicBezier } from 'tanbo-bezier';

import { UI_ROUTER_ANIMATION_STEPS } from '../../config';
import { ViewState, ViewStateService, UI_VIEW_INIT_STATE } from '../view/view-state.service';

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

    private subs: Array<Subscription> = [];

    constructor(private viewStateService: ViewStateService,
                @Inject(UI_VIEW_INIT_STATE) private state: ViewState,
                @Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number) {
    }

    ngOnInit() {
        const steps = this.steps;
        const bezier = new CubicBezier(.36, .66, .04, 1);
        this.subs.push(this.viewStateService.state.subscribe(state => {
            this.state = state;
        }));

        this.subs.push(this.viewStateService.touchProgress.subscribe(p => {
            if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
                this.translate = `translate3d(${p / steps * 100}%, 0, 0)`;
            } else if (this.state === ViewState.ToStack) {
                this.translate = `translate3d(${-33 + 33 * p / steps}%, 0, 0)`;
                this.opacity = 0.9 + 0.1 * p / steps;
            }
        }));
        this.subs.push(this.viewStateService.progress.subscribe((p: number) => {
            const progress = bezier.update(p / steps);
            switch (this.state) {
                case ViewState.Activate:
                    this.opacity = 1;
                    this.translate = `translate3d(${100 - progress * 100}%, 0, 0)`;
                    break;
                case ViewState.Destroy:
                    this.opacity = 1;
                    this.translate = `translate3d(${progress * 100}%, 0, 0)`;
                    break;
                case ViewState.ToStack:
                    this.translate = `translate3d(${progress * -33}%, 0, 0)`;
                    this.opacity = 1 - 0.1 * p / steps;
                    break;
                case ViewState.Reactivate:
                    let n = -33 + progress * 33;
                    // 当dom元素的style有transform属性时，会导致子级元素 position: fixed 全屏失效
                    // 会跟着有定位的父级同样大小
                    this.translate = n === 0 ? '' : `translate3d(${n}%, 0, 0)`;
                    this.opacity = 0.9 + 0.1 * progress;
                    break;
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => item.unsubscribe());
    }
}