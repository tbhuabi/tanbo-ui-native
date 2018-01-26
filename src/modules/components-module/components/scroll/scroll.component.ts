import {
    AfterViewInit,
    Component,
    ElementRef,
    HostBinding,
    Input,
    Inject,
    OnDestroy,
    OnInit,
    Renderer2
} from '@angular/core';
import { Subscription } from 'rxjs';
import 'hammerjs';

import { PullDownRefreshController } from '../../controllers/pull-down-refresh-controller';
import { UI_DO_LOAD_DISTANCE, PullUpLoadController } from '../../controllers/pull-up-load-controller';

@Component({
    selector: 'ui-scroll',
    templateUrl: './scroll.component.html'
})
export class ScrollComponent implements AfterViewInit, OnDestroy, OnInit {
    // 是否开启下拉刷新
    @Input()
    openRefresh: boolean = false;
    // 是否开启下拉刷新
    @Input()
    openInfinite: boolean = false;

    @HostBinding('style.transform')
    transform: string;

    private unBindFn: () => void;

    private sub: Subscription;

    private hammerInstance: HammerManager;

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef,
                @Inject(UI_DO_LOAD_DISTANCE) private doLoadDistance: number,
                private pullUpLoadController: PullUpLoadController,
                private pullDownRefreshController: PullDownRefreshController) {

    }

    ngOnInit() {
        this.sub = this.pullDownRefreshController.onStateChange.subscribe(n => {
            this.transform = `translateY(${n}px)`;
        });
    }

    ngAfterViewInit() {
        if (this.openRefresh) {
            this.bindingRefresher();
        }

        if (!this.openInfinite) {
            return;
        }

        const element = this.elementRef.nativeElement;

        this.unBindFn = this.renderer.listen(element, 'scroll', () => {
            // 计算最大滚动距离
            const maxScrollY = Math.max(element.scrollHeight, element.offsetHeight) - element.offsetHeight;
            // 如果当前滚动距离小于上拉刷新临界值，则记录相应值，并就广播相应事件
            if (maxScrollY - element.scrollTop < this.doLoadDistance) {
                this.pullUpLoadController.loading();
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        if (this.hammerInstance) {
            this.hammerInstance.off('panend');
        }
        if (this.unBindFn) {
            this.unBindFn();
        }
    }

    bindingRefresher() {
        const element = this.elementRef.nativeElement;

        const hammerInstance = new Hammer(element);

        this.hammerInstance = hammerInstance;

        hammerInstance.get('pan').set({
            direction: 30
        });

        let isFirstTouching: boolean = true;

        let isPullUpOrDown: boolean = true;

        hammerInstance.on('panup pandown panleft panright', (ev: HammerInput) => {
            if ((ev.type === 'panleft' || ev.type === 'panright') && isFirstTouching) {
                isPullUpOrDown = false;
            }
            isFirstTouching = false;

            if (isPullUpOrDown) {
                ev.srcEvent.stopPropagation();
                this.pullDownRefreshController.drag(ev.deltaY / 3);
            }
        });

        hammerInstance.on('panend', () => {
            isPullUpOrDown = true;
            isFirstTouching = true;
            this.pullDownRefreshController.dragEnd();
        });
    }
}