import {
    AfterContentInit,
    Component,
    ContentChildren,
    ElementRef,
    HostBinding,
    Input,
    QueryList,
    Renderer2
} from '@angular/core';
import { CollectionItemComponent } from '../collection-item/collection-item.component';

@Component({
    selector: 'ui-collection',
    templateUrl: './collection.component.html'
})
export class CollectionComponent implements AfterContentInit {
    @Input()
    @HostBinding('class.vertical')
    vertical: boolean = false;
    @ContentChildren(CollectionItemComponent)
    items: QueryList<CollectionItemComponent>;

    @HostBinding('style.width')
    get width() {
        return this.vertical ? 'auto' : this.childrenLength * 100 + '%';
    }

    @HostBinding('style.height')
    get height() {
        return this.vertical ? this.childrenLength * 100 + '%' : 'auto';
    }

    childrenLength: number = 0;

    private x: number = 0;
    private y: number = 0;

    constructor(private renderer: Renderer2,
                private elementRef: ElementRef) {
    }

    ngAfterContentInit() {
        this.childrenLength = this.items.toArray().length;
        if (this.vertical) {
            this.bindingVerticalDragEvent();
        } else {
            this.bindingHorizontalDragEvent();
        }
    }

    bindingHorizontalDragEvent() {
        let element = this.elementRef.nativeElement;
        this.renderer.listen(element, 'touchstart', (event: any) => {
            const point = event.touches[0];
            const startX = point.pageX;
            const startY = point.pageY;
            this.renderer.setStyle(element, 'transition-duration', '0s');
            const oldX = this.x;

            let unTouchMoveFn: () => void;
            let unTouchEndFn: () => void;
            let unTouchCancelFn: () => void;

            const itemWidth = element.offsetWidth / this.childrenLength;
            const minDistance = itemWidth - element.offsetWidth;

            const unbindFn = function () {
                unTouchMoveFn();
                unTouchEndFn();
                unTouchCancelFn();

                const targetIndex = Math.ceil(this.x / itemWidth);
                const offsetX = Math.abs(this.x % itemWidth);

                let translateX: number;
                if (offsetX < (itemWidth / 2)) {
                    translateX = targetIndex * itemWidth;
                } else {
                    translateX = targetIndex * itemWidth - itemWidth;
                }

                this.x = translateX;
                this.renderer.setStyle(element, 'transition-duration', '');
                this.renderer.setStyle(element, 'transform', `translateX(${translateX}px)`);

            }.bind(this);

            unTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
                const point = ev.touches[0];

                if (Math.abs(point.pageX - startX) < Math.abs(point.pageY - startY)) {
                    unbindFn();
                    return;
                }

                let distance = oldX + point.pageX - startX;
                if (distance > 0) {
                    distance = 0;
                }

                if (distance < minDistance) {
                    distance = minDistance;
                }
                this.x = distance;

                this.renderer.setStyle(element, 'transform', `translateX(${distance}px)`);
                ev.preventDefault();
                return false;
            });
            unTouchEndFn = this.renderer.listen('document', 'touchend', unbindFn);
            unTouchCancelFn = this.renderer.listen('document', 'touchcance', unbindFn);
        });
    }

    bindingVerticalDragEvent() {
        let element = this.elementRef.nativeElement;
        this.renderer.listen(element, 'touchstart', (event: any) => {
            const point = event.touches[0];
            const startX = point.pageX;
            const startY = point.pageY;
            this.renderer.setStyle(element, 'transition-duration', '0s');

            const oldY = this.y;

            let unTouchMoveFn: () => void;
            let unTouchEndFn: () => void;
            let unTouchCancelFn: () => void;

            const itemHeight = element.offsetHeight / this.childrenLength;
            const minDistance = itemHeight - element.offsetHeight;

            const unbindFn = function () {
                unTouchMoveFn();
                unTouchEndFn();
                unTouchCancelFn();

                const targetIndex = Math.ceil(this.y / itemHeight);
                const offsetY = Math.abs(this.y % itemHeight);

                let translateY: number;
                if (offsetY < (itemHeight / 2)) {
                    translateY = targetIndex * itemHeight;
                } else {
                    translateY = targetIndex * itemHeight - itemHeight;
                }

                this.y = translateY;
                this.renderer.setStyle(element, 'transition-duration', '');
                this.renderer.setStyle(element, 'transform', `translateY(${translateY}px)`);

            }.bind(this);

            unTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {

                const point = ev.touches[0];

                if (Math.abs(point.pageX - startX) > Math.abs(point.pageY - startY)) {
                    unbindFn();
                    return;
                }
                let distance = oldY + point.pageY - startY;
                if (distance > 0) {
                    distance = 0;
                }

                if (distance < minDistance) {
                    distance = minDistance;
                }
                this.y = distance;
                this.renderer.setStyle(element, 'transform', `translateY(${distance}px)`);
                ev.preventDefault();
                return false;
            });
            unTouchEndFn = this.renderer.listen('document', 'touchend', unbindFn);
            unTouchCancelFn = this.renderer.listen('document', 'touchcance', unbindFn);
        });
    }
}