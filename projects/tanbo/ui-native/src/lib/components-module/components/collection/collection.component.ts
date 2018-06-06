import {
    AfterContentInit,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    Input,
    OnDestroy,
    ViewChild,
    HostBinding,
    Output,
    QueryList,
    Renderer2
} from '@angular/core';
import { CollectionItemComponent } from '../collection-item/collection-item.component';
import { Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Easing } from '@tweenjs/tween.js';

@Component({
    selector: 'ui-collection',
    templateUrl: './collection.component.html'
})
export class CollectionComponent implements AfterContentInit, OnDestroy {
    // 拖动事件
    @Output()
    sliding = new EventEmitter<number>();
    // 拖动完成事件
    @Output()
    slidingFinish = new EventEmitter<number>();
    @Input()
    vertical: boolean = false;
    @Input()
    @HostBinding('class.fill')
    fill: boolean = false;

    @Input()
    set index(value: number) {
        this._index = value;
        if (this.items) {
            cancelAnimationFrame(this.animationId);
            this.setStyle();
        }
    }

    get index() {
        return this._index;
    }

    @ContentChildren(CollectionItemComponent)
    items: QueryList<CollectionItemComponent>;

    @ViewChild('container')
    container: ElementRef;

    // 通过子级的多少，计算自身的盒子大小
    get width() {
        return this.vertical ? 'auto' : this.childrenLength * 100 + '%';
    }

    get height() {
        return this.vertical ? this.childrenLength * 100 + '%' : 'auto';
    }

    childrenLength: number = 0;

    transform: string = '';

    private max: number = 0;

    private get min(): number {
        return -this.stepDistance * (this.childrenLength - 1);
    }

    // 每一页的距离
    private stepDistance: number;
    // 记录已拖动的距离
    private distance: number = 0;
    private slidingEvent$: Observable<number>;
    private slidingEventSource = new Subject<number>();

    private subs: Array<Subscription> = [];
    private element: HTMLElement;
    private containerElement: HTMLElement;
    private animationId: number;
    private _index: number = 0;

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef) {
        this.slidingEvent$ = this.slidingEventSource.asObservable();
    }

    ngAfterContentInit() {
        this.element = this.elementRef.nativeElement;
        this.containerElement = this.container.nativeElement;
        this.subs.push(this.slidingEvent$.pipe(distinctUntilChanged()).subscribe((n: number) => {
            this.sliding.emit(n);
        }));

        this.subs.push(this.items.changes.subscribe(_ => {
            this.childrenLength = this.items.length;
        }));

        this.childrenLength = this.items.length;
        this.bindingDragEvent();
        this.stepDistance = this.vertical ? this.element.offsetHeight : this.element.offsetWidth;
        this.setStyle();
    }

    ngOnDestroy() {
        this.subs.forEach(item => item.unsubscribe());
    }

    setStyle() {
        this.distance = this.index * -1 * this.stepDistance;
        this.transform = `translate${this.vertical ? 'Y' : 'X'}(${this.distance}px)`;
    }

    bindingDragEvent() {
        const element = this.element;

        this.renderer.listen(element, 'touchstart', (event: any) => {

            cancelAnimationFrame(this.animationId);

            const startTime = Date.now();
            const point = event.touches[0];
            const startX = point.pageX;
            const startY = point.pageY;
            const oldDistance = this.distance;

            let unTouchMoveFn: () => void;
            let unTouchEndFn: () => void;
            let unTouchCancelFn: () => void;

            let isMoved: boolean = false;
            const unbindFn = () => {
                const endTime = Date.now();
                isMoved = false;
                unTouchMoveFn();
                unTouchEndFn();
                unTouchCancelFn();

                if (this.distance > this.max) {
                    this.autoUpdateStyle(this.max);
                    return;
                } else if (this.distance < this.min) {
                    this.autoUpdateStyle(this.min);
                    return;
                }

                const targetIndex = Math.ceil(this.distance / this.stepDistance);
                const offset = Math.abs(this.distance % this.stepDistance);

                let translateDistance: number;
                // 如果拖动的时间小于 200ms，且距离大于100px，则按当前拖动的方向计算，并直接设置对应的值
                if (endTime - startTime < 200 && offset > 100) {
                    if (oldDistance < this.distance) {
                        translateDistance = targetIndex * this.stepDistance;
                    } else {
                        translateDistance = targetIndex * this.stepDistance - this.stepDistance;
                    }
                } else {
                    if (offset < (this.stepDistance / 2)) {
                        translateDistance = targetIndex * this.stepDistance;
                    } else {
                        translateDistance = targetIndex * this.stepDistance - this.stepDistance;
                    }
                }

                this.autoUpdateStyle(translateDistance);
            };

            unTouchMoveFn = this.renderer.listen(element, 'touchmove', (ev: any) => {
                const movePoint = ev.touches[0];
                let distance: number;

                if (this.vertical) {
                    // 如果开启的是垂直方向拖动，但 x 轴的距离大于 y 轴，则取消触摸
                    if ((Math.abs(movePoint.pageX - startX) > Math.abs(movePoint.pageY - startY)) && !isMoved) {
                        unbindFn();
                        return;
                    } else {
                        isMoved = true;
                    }
                    distance = oldDistance + movePoint.pageY - startY;
                } else {
                    // 如果开启的是水平方向拖动，但 y 轴的距离大于 x 轴，则取消触摸
                    if ((Math.abs(movePoint.pageX - startX) < Math.abs(movePoint.pageY - startY)) && !isMoved) {
                        unbindFn();
                        return;
                    } else {
                        isMoved = true;
                    }
                    distance = oldDistance + movePoint.pageX - startX;
                }

                if (distance > this.max) {
                    distance /= 3;
                } else if (distance < this.min) {
                    distance = this.min + (distance - this.min) / 3;
                }

                this.distance = distance;
                this.transform = `translate${this.vertical ? 'Y' : 'X'}(${distance}px)`;
                ev.preventDefault();
                // 发送事件，并传出当前已滑动到第几屏的进度
                this.slidingEventSource.next(distance / this.stepDistance * -1);
                ev.stopPropagation();
                return false;
            });
            unTouchEndFn = this.renderer.listen(element, 'touchend', unbindFn);
            unTouchCancelFn = this.renderer.listen(element, 'touchcancel', unbindFn);
        });
    }

    private autoUpdateStyle(translateDistance: number) {
        const max = 20;
        let step = 0;

        const distance = translateDistance - this.distance;

        if (distance === 0) {
            return;
        }

        const rawDistance = this.distance;

        const moveToTarget = () => {
            step++;
            const translate = rawDistance + Easing.Cubic.Out(step / max) * distance;
            this.distance = translate;
            this.transform = `translate${this.vertical ? 'Y' : 'X'}(${translate}px)`;

            this.slidingEventSource.next(translate / this.stepDistance * -1);
            if (step < max) {
                this.animationId = requestAnimationFrame(moveToTarget);
            } else {
                // 发送事件，并传出当前滑动到了第几屏
                this.slidingFinish.emit(this.distance / this.stepDistance * -1);
            }
        };

        this.animationId = requestAnimationFrame(moveToTarget);
    }
}