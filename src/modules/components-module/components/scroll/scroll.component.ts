import {
    AfterViewInit,
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    Output,
    Renderer2
} from '@angular/core';
import { Observable, Subject, Subscription } from 'rxjs';
import * as TWEEN from '@tweenjs/tween.js';

@Component({
    selector: 'ui-scroll',
    templateUrl: './scroll.component.html'
})
export class ScrollComponent implements AfterViewInit, OnDestroy {
    // 是否开启下拉刷新
    @Input()
    openRefresh: boolean = false;
    // 触发下拉刷新临界距离
    @Input()
    actionDistanceTop: number = 60;
    // 触发上拉加载临界距离
    @Input()
    actionDistanceBottom: number = 600;

    @HostBinding('style.transform')
    transform: string;

    @Output()
    dragging = new EventEmitter<number>();
    @Output()
    refresh = new EventEmitter<() => void>();
    @Output()
    infinite = new EventEmitter<() => void>();

    private translateY: number = 0;
    private unBindFnList: Array<() => void> = [];

    private infinite$: Observable<void>;
    private infiniteSource = new Subject<void>();
    private sub: Subscription;
    private animationId: number;
    // 记录用户是否正在触摸
    private isTouching: boolean = false;

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef) {

        this.infinite$ = this.infiniteSource.asObservable();
    }

    ngAfterViewInit() {
        if (this.openRefresh) {
            this.bindingRefresher();
        }

        const element = this.elementRef.nativeElement;
        // 记录上一次有效距离
        let oldScrollTop: number = null;
        // 当触发滚动，且是向上拉的情况，触发加载事件
        this.sub = this.infinite$.debounceTime(300).subscribe(() => {
            if (element.scrollTop >= oldScrollTop) {
                oldScrollTop = null;
                this.infinite.emit();
            }
        });

        const fn = this.renderer.listen(element, 'scroll', () => {
            // 计算最大滚动距离
            const maxScrollY = Math.max(element.scrollHeight, element.offsetHeight) - element.offsetHeight;
            // 如果当前滚动距离小于上拉刷新临界值，则记录相应值，并就广播相应事件
            if (maxScrollY - element.scrollTop < this.actionDistanceBottom) {
                if (oldScrollTop === null) {
                    oldScrollTop = element.scrollTop;
                }
                this.infiniteSource.next();
            } else {
                oldScrollTop = null;
            }
        });
        this.unBindFnList.push(fn);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.unBindFnList.forEach(item => {
            item();
        });
    }

    bindingRefresher() {
        const element = this.elementRef.nativeElement;
        const fn = this.renderer.listen(element, 'touchstart', (event: any) => {
            cancelAnimationFrame(this.animationId);

            this.isTouching = true;
            const oldPoint = event.touches[0];

            const oldY = oldPoint.pageY;
            const oldX = oldPoint.pageX;
            const oldScrollTop = element.scrollTop;

            let isScroll = true;

            // 记录上一次未还原的偏移值
            const oldTranslateY = this.translateY;

            let cancelTouchCancelFn: () => void;
            let cancelTouchEndFn: () => void;
            let touchedFn: () => void;

            const cancelTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
                const newPoint = ev.touches[0];
                const newY = newPoint.pageY;
                const newX = newPoint.pageX;
                const distance = newY - oldY;

                if (isScroll && Math.abs(newX - oldX) >= Math.abs(newY - oldY)) {
                    touchedFn();
                    return;
                }

                isScroll = false;

                let translateY = 0;

                // 最新偏移值，且一定要小于0
                const distanceTop = Math.ceil((distance - oldScrollTop) / 3) + oldTranslateY;
                if (distanceTop > 0 && this.openRefresh) {
                    translateY = distanceTop;
                }

                // 如果偏移值发生改变，则改变样式
                if (this.translateY !== translateY) {
                    this.translateY = translateY;
                    this.dragging.emit(translateY);
                    this.transform = `translateY(${translateY}px)`;
                }
                if (translateY !== 0) {
                    ev.preventDefault();
                    return false;
                }

            });

            const complete = () => {
                if (this.isTouching) {
                    return;
                }
                this.scroll(this.translateY, 0);
            };

            touchedFn = function () {
                this.isTouching = false;
                let distanceTop = Math.abs(Number(this.actionDistanceTop));

                // 当用户取消触摸时，根据当前距离，判断是否触发刷新事件
                if (this.translateY > 0 && this.translateY > distanceTop) {
                    this.scroll(this.translateY, distanceTop);
                    this.refresh.emit(complete);
                } else {
                    this.scroll(this.translateY, 0);
                }
                cancelTouchMoveFn();
                cancelTouchEndFn();
                cancelTouchCancelFn();
            }.bind(this);

            cancelTouchCancelFn = this.renderer.listen('document', 'touchcancel', touchedFn);
            cancelTouchEndFn = this.renderer.listen('document', 'touchend', touchedFn);
        });

        this.unBindFnList.push(fn);
    }

    private scroll(start: number, target: number) {
        const max = 20;
        let step = 0;

        const distance = target - start;

        const animationFn = function () {
            if (this.isTouching) {
                return;
            }
            step++;
            const distanceTop = TWEEN.Easing.Cubic.Out(step / max) * distance + start;
            this.translateY = distanceTop;
            this.transform = `translateY(${distanceTop}px)`;
            this.dragging.emit(distanceTop);
            if (step < max) {
                this.animationId = requestAnimationFrame(animationFn);
            }

        }.bind(this);

        this.animationId = requestAnimationFrame(animationFn);
    }
}