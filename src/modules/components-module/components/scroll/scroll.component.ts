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
    rolling = new EventEmitter<number>();
    @Output()
    refresh = new EventEmitter<() => void>();
    @Output()
    infinite = new EventEmitter<() => void>();

    private translateY: number = 0;
    private unBindFnList: Array<() => void> = [];

    private infinite$: Observable<void>;
    private infiniteSource = new Subject<void>();
    private sub: Subscription;

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
        // 记录用户是否正在触摸
        let isTouching: boolean = false;
        const element = this.elementRef.nativeElement;
        const fn = this.renderer.listen(element, 'touchstart', (event: any) => {
            isTouching = true;
            const oldPoint = event.touches[0];

            const oldY = oldPoint.pageY;
            const oldScrollTop = element.scrollTop;

            this.renderer.setStyle(element, 'transitionDuration', '0ms');

            // 记录上一次未还原的偏移值
            const oldTranslateY = this.translateY;

            const cancelTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
                const newPoint = ev.touches[0];
                const newY = newPoint.pageY;
                const distance = newY - oldY;

                let translateY = 0;

                // 最新偏移值，且一定要小于0
                const distanceTop = Math.ceil((distance - oldScrollTop) / 3) + oldTranslateY;
                if (distanceTop > 0 && this.openRefresh) {
                    translateY = distanceTop;
                }

                // 如果偏移值发生改变，则改变样式
                if (this.translateY !== translateY) {
                    this.translateY = translateY;
                    this.rolling.emit(translateY);
                    this.transform = `translateY(${translateY}px)`;
                }
                if (translateY !== 0) {
                    ev.preventDefault();
                    return false;
                }

            });
            let cancelTouchCancelFn: () => void;
            let cancelTouchEndFn: () => void;

            const complete = function () {
                if (isTouching) {
                    return;
                }
                this.translateY = 0;
                this.transform = null;
            }.bind(this);

            const touchedFn = function () {
                isTouching = false;
                let distanceTop = Math.abs(Number(this.actionDistanceTop));
                this.renderer.setStyle(element, 'transition-duration', '');

                // 当用户取消触摸时，根据当前距离，判断是否触发刷新事件
                if (this.translateY > 0 && this.translateY > distanceTop) {
                    this.translateY = distanceTop;
                    this.transform = `translateY(${distanceTop}px)`;
                    this.rolling.emit(distanceTop);
                    this.refresh.emit(complete);
                } else {
                    this.rolling.emit(0);
                    this.translateY = 0;
                    this.transform = null;
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
}