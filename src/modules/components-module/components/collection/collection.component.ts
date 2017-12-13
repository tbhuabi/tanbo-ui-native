import {
    AfterContentInit,
    AfterViewInit,
    Component,
    ContentChildren,
    ElementRef,
    EventEmitter,
    HostBinding,
    Input,
    OnDestroy,
    Output,
    QueryList,
    Renderer2
} from '@angular/core';
import { CollectionItemComponent } from '../collection-item/collection-item.component';
import { Observable, Subject, Subscription } from 'rxjs';
import { Easing } from '@tweenjs/tween.js';

@Component({
    selector: 'ui-collection',
    templateUrl: './collection.component.html'
})
export class CollectionComponent implements AfterContentInit, OnDestroy, AfterViewInit {
    // 拖动事件
    @Output()
    sliding = new EventEmitter<number>();
    // 拖动完成事件
    @Output()
    slidingFinish = new EventEmitter<number>();
    @Input()
    @HostBinding('class.vertical')
    vertical: boolean = false;

    @Input()
    set index(value: number) {
        this._index = value;
        if (this.items) {
            cancelAnimationFrame(this.animationId);
            const boxSize: number = this.vertical ? this.element.offsetHeight : this.element.offsetWidth;
            const itemWidth: number = boxSize / this.items.length;
            this.autoUpdateStyle(this.element, itemWidth * value * -1, itemWidth);
        }
    }

    get index() {
        return this._index;
    }

    @ContentChildren(CollectionItemComponent)
    items: QueryList<CollectionItemComponent>;

    // 通过子级的多少，计算自身的盒子大小
    @HostBinding('style.width')
    get width() {
        return this.vertical ? 'auto' : this.childrenLength * 100 + '%';
    }

    @HostBinding('style.height')
    get height() {
        return this.vertical ? this.childrenLength * 100 + '%' : 'auto';
    }

    childrenLength: number = 0;

    // 记录已拖动的距离
    private distance: number = 0;
    private slidingEvent$: Observable<number>;
    private slidingEventSource = new Subject<number>();

    private sub: Subscription;
    private element: HTMLElement;
    private animationId: number;
    private _index: number = 0;

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef) {
        this.slidingEvent$ = this.slidingEventSource.asObservable();
    }

    ngAfterContentInit() {
        this.element = this.elementRef.nativeElement;
        this.sub = this.slidingEvent$.distinctUntilChanged().subscribe((n: number) => {
            this.sliding.emit(n);
        });
        this.childrenLength = this.items.length;
        this.bindingDragEvent();
    }

    ngAfterViewInit() {
        this.setPosition();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    setPosition() {
        let element = this.element;
        let itemWidth: number;
        if (this.vertical) {
            itemWidth = element.offsetHeight / this.childrenLength;
        } else {
            itemWidth = element.offsetWidth / this.childrenLength;
        }
        this.distance = this.index * -1 * itemWidth;
        const style = `translate${this.vertical ? 'Y' : 'X'}(${this.distance}px)`;
        this.renderer.setStyle(element, 'transform', style);
    }

    bindingDragEvent() {
        let element = this.element;

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

            let boxSize: number;
            let maxDistance: number;
            if (this.vertical) {
                const offsetHeight = element.offsetHeight;
                boxSize = offsetHeight / this.childrenLength;
                maxDistance = boxSize - offsetHeight;
            } else {
                const offsetWidth = element.offsetWidth;
                boxSize = offsetWidth / this.childrenLength;
                maxDistance = boxSize - offsetWidth;
            }

            let isMoved: boolean = false;
            const unbindFn = function () {
                const endTime = Date.now();
                isMoved = false;
                unTouchMoveFn();
                unTouchEndFn();
                unTouchCancelFn();

                const targetIndex = Math.ceil(this.distance / boxSize);
                const offset = Math.abs(this.distance % boxSize);

                let translateDistance: number;
                // 如果拖动的时间小于 200ms，且距离大于100px，则按当前拖动的方向计算，并直接设置对应的值
                if (endTime - startTime < 200 && offset > 100) {
                    if (oldDistance < this.distance) {
                        translateDistance = targetIndex * boxSize;
                    } else {
                        translateDistance = targetIndex * boxSize - boxSize;
                    }
                } else {
                    if (offset < (boxSize / 2)) {
                        translateDistance = targetIndex * boxSize;
                    } else {
                        translateDistance = targetIndex * boxSize - boxSize;
                    }
                }

                this.autoUpdateStyle(element, translateDistance, boxSize);
            }.bind(this);

            unTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
                const point = ev.touches[0];
                let distance: number;

                if (this.vertical) {
                    // 如果开启的是垂直方向拖动，但 x 轴的距离大于 y 轴，则取消触摸
                    if ((Math.abs(point.pageX - startX) > Math.abs(point.pageY - startY)) && !isMoved) {
                        unbindFn();
                        return;
                    } else {
                        isMoved = true;
                    }
                    distance = oldDistance + point.pageY - startY;
                } else {
                    // 如果开启的是水平方向拖动，但 y 轴的距离大于 x 轴，则取消触摸
                    if ((Math.abs(point.pageX - startX) < Math.abs(point.pageY - startY)) && !isMoved) {
                        unbindFn();
                        return;
                    } else {
                        isMoved = true;
                    }
                    distance = oldDistance + point.pageX - startX;
                }
                if (distance > 0) {
                    distance = 0;
                }

                if (distance < maxDistance) {
                    distance = maxDistance;
                }
                this.distance = distance;
                this.renderer.setStyle(element, 'transform', `translate${this.vertical ? 'Y' : 'X'}(${distance}px)`);
                ev.preventDefault();
                // 发送事件，并传出当前已滑动到第几屏的进度
                this.slidingEventSource.next(distance / boxSize * -1);
                return false;
            });
            unTouchEndFn = this.renderer.listen('document', 'touchend', unbindFn);
            unTouchCancelFn = this.renderer.listen('document', 'touchcancel', unbindFn);
        });
    }

    private autoUpdateStyle(element: HTMLElement, translateDistance: number, boxSize: number) {
        const max = 20;
        let step = 0;

        const distance = translateDistance - this.distance;

        if (distance === 0) {
            return;
        }

        const rawDistance = this.distance;

        const moveToTarget = function () {
            step++;
            const translate = rawDistance + Easing.Cubic.Out(step / max) * distance;
            this.distance = translate;
            const style = `translate${this.vertical ? 'Y' : 'X'}(${translate}px)`;

            this.renderer.setStyle(element, 'transform', style);
            this.slidingEventSource.next(translate / boxSize * -1);
            if (step < max) {
                this.animationId = requestAnimationFrame(moveToTarget);
            } else {
                // 发送事件，并传出当前滑动到了第几屏
                this.slidingFinish.emit(this.distance / boxSize * -1);
            }
        }.bind(this);

        this.animationId = requestAnimationFrame(moveToTarget);
    }
}