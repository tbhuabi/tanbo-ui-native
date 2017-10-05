import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';

const TWEEN = require('tween.js');

@Component({
    selector: 'ui-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnDestroy, OnInit {
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
                    this.translate = `translateX(${-50 + progress * 100 / 2}%)`;
                    break;
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}