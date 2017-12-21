import { Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Easing } from '@tweenjs/tween.js';

import { UI_ROUTER_ANIMATION_STEPS, BrowserENV, UI_BROWSER_ENV } from '../../config';
import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';
import { AppController } from '../app/app-controller';

@Component({
    selector: 'ui-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    // 根据不同环境，需要把页面头部增高相对尺寸，以显示时间，电池电量等信息，这里通过样式来控制
    @HostBinding('class.iphone')
    get isIphone() {
        return this.env === BrowserENV.iphone;
    }

    @HostBinding('class.iphone-x')
    get isIphoneX() {
        return this.env === BrowserENV.iphoneX;
    }

    @HostBinding('class.android')
    get isAndroid() {
        return this.env === BrowserENV.android;
    }

    @HostBinding('class.default')
    get isDefault() {
        return this.env === BrowserENV.default;
    }

    @HostBinding('style.opacity')
    opacity: number;

    private subs: Array<Subscription> = [];
    private state: ViewState;

    constructor(private viewStateService: ViewStateService,
                private appController: AppController,
                @Inject(UI_BROWSER_ENV) private env: BrowserENV,
                @Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number) {
    }

    ngOnInit() {
        this.subs.push(this.appController.onResize$.subscribe((env: BrowserENV) => {
            this.env = env;
        }));
        const steps = this.steps;
        this.subs.push(this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
            switch (status.state) {
                case ViewState.Activate:
                    this.state = status.state;
                    this.opacity = Easing.Linear.None(status.progress / steps);
                    break;
                case ViewState.Destroy:
                    this.state = status.state;
                    this.opacity = Easing.Linear.None(1 - status.progress / steps);
                    break;
                case ViewState.ToStack:
                case ViewState.Reactivate:
                    this.state = status.state;
                    this.opacity = 1;
                    break;
                case ViewState.Moving:
                    if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
                        this.opacity = Easing.Linear.None(1 - status.progress / steps);
                    }
                    break;
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }
}