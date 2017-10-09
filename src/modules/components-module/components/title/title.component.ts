import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import * as TWEEN from '@tweenjs/tween.js';

import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-title',
    templateUrl: './title.component.html'
})
export class TitleComponent implements OnDestroy, OnInit {
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
            let n: number;
            switch (status.state) {
                case ViewState.Activate:
                    this.state = status.state;
                    this.translate = `translate3d(${70 - progress * 70}%, 0, 0)`;
                    break;
                case ViewState.Destroy:
                    this.state = status.state;
                    this.translate = `translate3d(${progress * 70}%, 0, 0)`;
                    break;
                case ViewState.ToStack:
                    this.state = status.state;
                    this.translate = `translate3d(${progress * -48}%, 0, 0)`;
                    n = 1 - progress * 1.3;
                    this.opacity = n < 0 ? 0 : n;
                    break;
                case ViewState.Reactivate:
                    this.state = status.state;
                    this.translate = `translate3d(${-48 + progress * 48}%, 0, 0)`;
                    n = progress * 2;
                    this.opacity = n > 1 ? 1 : n;
                    break;
                case ViewState.Moving:
                    if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
                        this.translate = `translate3d(${status.progress * 0.7}%, 0, 0)`;
                    } else if (this.state === ViewState.ToStack) {
                        this.translate = `translate3d(${-50 + status.progress / 2}%, 0, 0)`;
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