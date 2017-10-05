import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';

const TWEEN = require('tween.js');

@Component({
    selector: 'ui-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    // 当是生产环境时，需要把页面头部增高相对尺寸，以显示时间，电池电量等信息，这里通过样式来控制
    @HostBinding('class.native')
    isNative: boolean = process.env.ENV === 'production';
    @HostBinding('style.opacity')
    opacity: number = 1;

    private sub: Subscription;

    constructor(private viewStateService: ViewStateService) {
    }

    ngOnInit() {
        this.sub = this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
            switch (status.state) {
                case ViewState.Activate:
                    this.opacity = TWEEN.Easing.Linear.None(status.progress / 100);
                    break;
                case ViewState.Destroy:
                    this.opacity = TWEEN.Easing.Linear.None(1 - status.progress / 100);
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}