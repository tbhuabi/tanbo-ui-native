import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';

const TWEEN = require('tween.js');

@Component({
    selector: 'ui-content',
    templateUrl: './content.component.html'
})
export class ContentComponent implements OnDestroy, OnInit {
    @HostBinding('style.transform')
    translate: string;
    private sub: Subscription;

    constructor(private viewStateService: ViewStateService) {
    }

    ngOnInit() {
        this.sub = this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
            const progress = TWEEN.Easing.Cubic.Out(status.progress / 100);
            switch (status.state) {
                case ViewState.Activate:
                    this.translate = `translateX(${100 - progress * 100}%)`;
                    break;
                case ViewState.Destroy:
                    this.translate = `translateX(${progress * 100}%)`;
                    break;
                case ViewState.ToStack:
                    this.translate = `translateX(${progress * 100 / -2}%)`;
                    break;
                case ViewState.Reactivate:
                    let n = -50 + progress * 100 / 2;
                    // 当dom元素的style有transform属性时，会导致子级元素 position: fixed 全屏失效
                    // 会跟着有定位的父级同样大小
                    this.translate = n === 0 ? '' : `translateX(${n}%)`;
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}