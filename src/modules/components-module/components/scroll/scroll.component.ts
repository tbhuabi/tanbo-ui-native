import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    Output,
    OnInit,
    Renderer2
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import { Easing } from '@tweenjs/tween.js';
import 'hammerjs';

import { PullDownRefreshController } from '../../controllers/pull-down-refresh-controller';

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


    private unBindFnList: Array<() => void> = [];

    private infinite$: Observable<void>;
    private infiniteSource = new Subject<void>();
    private subs: Array<Subscription> = [];
    // 记录用户是否正在触摸

    private isLoading: boolean = false;

    private hammerInstance: HammerManager;

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef,
                private pullDownRefreshController: PullDownRefreshController) {

        this.infinite$ = this.infiniteSource.asObservable();
    }

    ngOnInit() {

        this.subs.push(this.pullDownRefreshController.onStateChange.subscribe(n => {
            this.transform = `translateY(${n}px)`;
        }));

    }

    ngAfterViewInit() {
        if (this.openRefresh) {
            this.bindingRefresher();
        }

        if (!this.openInfinite) {
            return;
        }

        // const element = this.elementRef.nativeElement;
        //
        // // 当触发滚动，且是向上拉的情况，触发加载事件
        // this.subs.push(this.infinite$.subscribe(() => {
        //     this.infinite.emit(() => {
        //         this.isLoading = false;
        //     });
        // }));
        //
        // const fn = this.renderer.listen(element, 'scroll', () => {
        //     if (this.isLoading) {
        //         return;
        //     }
        //     // 计算最大滚动距离
        //     const maxScrollY = Math.max(element.scrollHeight, element.offsetHeight) - element.offsetHeight;
        //     // 如果当前滚动距离小于上拉刷新临界值，则记录相应值，并就广播相应事件
        //     if (maxScrollY - element.scrollTop < this.doLoadingDistance) {
        //         this.isLoading = true;
        //         this.infiniteSource.next();
        //     }
        // });
        // this.unBindFnList.push(fn);
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });

        this.hammerInstance.off('panend');
        this.unBindFnList.forEach(item => {
            item();
        });
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