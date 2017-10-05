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
            switch (status.state) {
                case ViewState.Activate:
                    this.translate = `translateX(${100 - progress * 100}%)`;
                    this.opacity = progress;
                    break;
                case ViewState.Destroy:
                    this.translate = `translateX(${progress * 100}%)`;
                    const n = 1 - TWEEN.Easing.Linear.None(status.progress / 100) * 2;
                    this.opacity = n < 0 ? 0 : n;
                    break;
                case ViewState.ToStack:
                    this.translate = `translateX(${progress * 100 / -2}%)`;
                    this.opacity = 1 - progress;
                    break;
                case ViewState.Reactivate:
                    this.translate = `translateX(${-50 + progress * 100 / 2}%)`;
                    this.opacity = progress;
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}