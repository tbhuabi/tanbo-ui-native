import { Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Easing } from '@tweenjs/tween.js';

import { UI_ROUTER_ANIMATION_STEPS } from '../../config';
import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-header',
    templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
    @HostBinding('style.opacity')
    opacity: number;

    private sub: Subscription;
    private state: ViewState;

    constructor(private viewStateService: ViewStateService,
                @Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number) {
    }

    ngOnInit() {
        const steps = this.steps;
        this.sub = this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
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
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}