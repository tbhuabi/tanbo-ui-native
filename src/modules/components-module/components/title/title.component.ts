import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    HostListener, Inject,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import * as TWEEN from '@tweenjs/tween.js';

import { UI_ROUTER_ANIMATION_STEPS } from '../../config';
import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-title',
    templateUrl: './title.component.html'
})
export class TitleComponent implements OnDestroy, OnInit, AfterViewInit {
    @HostBinding('style.transform')
    translate: string;
    @HostBinding('style.opacity')
    opacity: number;

    @ViewChild('content')
    contentElement: ElementRef;

    private sub: Subscription;
    private state: ViewState;
    private docWidth: number;
    private contentWidth: number = 0;
    private translateDistance: number;

    constructor(@Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number,
                private elementRef: ElementRef,
                private viewStateService: ViewStateService) {
    }

    @HostListener('window:resize')
    resize() {
        this.docWidth = this.elementRef.nativeElement.offsetWidth;
        this.translateDistance = this.docWidth / 2 - this.contentWidth / 2;
    }

    ngOnInit() {
        const steps = this.steps;
        this.sub = this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
            const progress = TWEEN.Easing.Cubic.Out(status.progress / steps);
            let n: number;
            let translate: number;
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
                    this.translate = `translate3d(${-progress * this.translateDistance}px, 0, 0)`;
                    n = 1 - progress * 1.3;
                    this.opacity = n < 0 ? 0 : n;
                    break;
                case ViewState.Reactivate:
                    this.state = status.state;
                    translate = -this.translateDistance + this.translateDistance * progress;
                    this.translate = `translate3d(${translate}px, 0, 0)`;
                    n = progress * 2;
                    this.opacity = n > 1 ? 1 : n;
                    break;
                case ViewState.Moving:
                    if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
                        this.translate = `translate3d(${status.progress / steps * 100 * 0.7}%, 0, 0)`;
                    } else if (this.state === ViewState.ToStack) {
                        translate = -this.translateDistance + this.translateDistance * status.progress / steps;
                        this.translate = `translate3d(${translate}px, 0, 0)`;
                        this.opacity = 0.9 + 0.1 * status.progress / steps;
                    }
                    break;

            }
        });
    }

    ngAfterViewInit() {
        this.docWidth = this.elementRef.nativeElement.offsetWidth;
        this.contentWidth = this.contentElement.nativeElement.offsetWidth;
        this.translateDistance = this.docWidth / 2 - this.contentWidth / 2;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}