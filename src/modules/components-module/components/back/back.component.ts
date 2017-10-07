import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';
import { NavController } from '../navigation/navigation-controller.service';

const TWEEN = require('tween.js');

@Component({
    selector: 'ui-back',
    templateUrl: './back.component.html'
})
export class BackComponent implements OnInit, OnDestroy {
    opacity: number = 1;
    translate: string;

    private sub: Subscription;
    private state: ViewState;

    constructor(private navController: NavController,
                private viewStateService: ViewStateService) {
    }

    @HostListener('click')
    click() {
        // 当用户点击组件时，触发视图返回上一页
        this.navController.pop();
    }

    ngOnInit() {
        this.sub = this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
            const progress = TWEEN.Easing.Cubic.Out(status.progress / 100);
            let n: number = status.progress / 50;
            let m: number;
            switch (status.state) {
                case ViewState.Activate:
                    this.state = status.state;
                    this.translate = `translateX(${100 - progress * 100}%)`;
                    this.opacity = progress;
                    break;
                case ViewState.Destroy:
                    this.state = status.state;
                    this.translate = `translateX(${progress * 100}%)`;
                    m = 1 - n;
                    this.opacity = m < 0 ? 0 : m;
                    break;
                case ViewState.ToStack:
                    this.state = status.state;
                    this.translate = `translateX(${status.progress / -2}%)`;
                    m = 1 - n;
                    this.opacity = m < 0 ? 0 : m;
                    break;
                case ViewState.Reactivate:
                    this.state = status.state;
                    this.translate = `translateX(${-50 + progress * 50}%)`;
                    m = progress * 2;
                    this.opacity = m > 1 ? 1 : m;
                    break;
                case ViewState.Moving:
                    if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
                        this.translate = `translateX(${status.progress}%)`;
                        m = 1 - n;
                        this.opacity = m < 0 ? 0 : m;
                    } else if (this.state === ViewState.ToStack) {
                        this.translate = `translateX(${-50 + status.progress / 2}%)`;
                        m = progress * 2;
                        this.opacity = m > 1 ? 1 : m;
                    }
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}