import {
    AfterViewInit,
    Component,
    ElementRef,
    HostListener,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    ViewChild
} from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { Subscription } from 'rxjs';
import * as TWEEN from '@tweenjs/tween.js';

import { ViewAnimationStatus, ViewState, ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-back',
    templateUrl: './back.component.html'
})
export class BackComponent implements OnInit, OnDestroy, AfterViewInit {
    opacity: number = 1;
    translate: string;
    @ViewChild('text')
    textElement: ElementRef;

    @Input()
    icon: string = 'ui-icon-arrow-back';

    private sub: Subscription;
    private state: ViewState;
    private docWidth: number;
    private contentWidth: number;
    private leftDistance: number;
    private translateDistance: number;

    constructor(@Inject(DOCUMENT) private document: Document,
                private location: Location,
                private viewStateService: ViewStateService) {
    }

    @HostListener('window:resize')
    resize() {
        this.docWidth = this.document.body.offsetWidth;
        this.translateDistance = this.docWidth / 2 - (this.leftDistance + 10) - this.contentWidth / 2;
    }

    @HostListener('click')
    click() {
        // 当用户点击组件时，触发视图返回上一页
        this.location.back();
    }

    ngOnInit() {
        this.sub = this.viewStateService.state$.subscribe((status: ViewAnimationStatus) => {
            const progress = TWEEN.Easing.Cubic.Out(status.progress / 100);

            let n: number = status.progress / 50;
            let m: number;
            switch (status.state) {
                case ViewState.Activate:
                    this.state = status.state;
                    let distance = this.translateDistance - progress * this.translateDistance;
                    this.translate = `translate3d(${distance}px, 0, 0)`;
                    break;
                case ViewState.Destroy:
                    this.state = status.state;
                    this.translate = `translate3d(${this.translateDistance * progress}px, 0, 0)`;
                    break;
                case ViewState.ToStack:
                    this.state = status.state;
                    this.translate = `translate3d(${-status.progress}%, 0, 0)`;
                    m = 1 - n;
                    this.opacity = m < 0 ? 0 : m;
                    break;
                case ViewState.Reactivate:
                    this.state = status.state;
                    this.translate = `translate3d(${-50 + progress * 50}%, 0, 0)`;
                    m = progress * 2;
                    this.opacity = m > 1 ? 1 : m;
                    break;
                case ViewState.Moving:
                    if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
                        this.translate = `translate3d(${status.progress / 100 * this.translateDistance}px, 0, 0)`;
                        m = 1 - n;
                        this.opacity = m < 0 ? 0 : m;
                    } else if (this.state === ViewState.ToStack) {
                        this.translate = `translate3d(${-50 + status.progress / 2}%, 0, 0)`;
                        m = progress * 2;
                        this.opacity = m > 1 ? 1 : m;
                    }
                    break;
            }
        });
    }

    ngAfterViewInit() {
        this.docWidth = this.document.body.offsetWidth;
        this.contentWidth = this.textElement.nativeElement.offsetWidth;
        this.leftDistance = this.textElement.nativeElement.offsetLeft;
        this.translateDistance = this.docWidth / 2 - (this.leftDistance + 10) - this.contentWidth / 2;
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}