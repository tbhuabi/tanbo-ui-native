import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { ListEventService } from '../list-item/list-event.service';
import { ListActivatedService } from '../list-item/list-activated.service';

@Component({
    selector: 'ui-list-sliding',
    templateUrl: './list-sliding.component.html'
})
export class ListSlidingComponent implements OnInit, OnDestroy {
    private subs: Array<Subscription> = [];
    private distanceX: number = 0;
    private refs: Array<ElementRef> = [];
    private isFocus = false;

    constructor(private listEventService: ListEventService,
                private elementRef: ElementRef,
                private listActivatedService: ListActivatedService,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        // 拿到当前 list-item 组件下，所有的 list-options 组件，以便在划动时，计算 dom 的宽度
        this.subs.push(this.listEventService.listOptions$.subscribe((elementRef: ElementRef) => {
            this.refs.push(elementRef);
        }));
        // 订阅选中事件，并判断用户操作的 list-sliding 是不是自身，如果不是自身，则修改自身相应样式
        this.subs.push(this.listActivatedService.activatedComponent$.subscribe(() => {
            if (!this.isFocus) {
                this.distanceX = 0;
                this.renderer.setStyle(this.elementRef.nativeElement, 'transition-duration', '');
                this.renderer.setStyle(this.elementRef.nativeElement, 'transform', `translateX(0px)`);
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }

    @HostListener('touchstart', ['$event'])
    touchstart(event: any) {
        this.isFocus = true;
        const touchPoint = event.touches[0];

        const startX = touchPoint.pageX;
        const startY = touchPoint.pageY;

        const element = event.target;
        const oldDistanceX = this.distanceX;
        const startTime = Date.now();

        let maxDistance = 0;

        this.refs.forEach((item: ElementRef) => {
            maxDistance += item.nativeElement.offsetWidth;
        });

        let isClick = true;
        let isScroll = true;

        // 设置当前元素的 css 动画时间为0，防止有迟滞感
        this.renderer.setStyle(element, 'transition-duration', '0s');

        let unBindTouchEndFn: () => void;
        let unBindTouchCancelFn: () => void;

        let unBindTouchMoveFn = this.renderer.listen('document', 'touchmove', (moveEvent: any) => {
            isClick = false;
            const newTouchPoint = moveEvent.touches[0];

            const moveX = newTouchPoint.pageX;
            const moveY = newTouchPoint.pageY;

            // 当用户触摸的纵向距离大于横向距离，能忽略此次划动，不触发各左滑动的动作
            if (isScroll && Math.abs(moveX - startX) < Math.abs(moveY - startY)) {
                unBindTouchCancelFn();
                unBindTouchMoveFn();
                unBindTouchEndFn();
                return;
            }

            // 计算向左滑动的距离
            this.distanceX = moveX - startX + oldDistanceX;
            if (this.distanceX > 0) {
                this.distanceX = 0;
            }
            if (this.distanceX < -maxDistance) {
                this.distanceX = -maxDistance;
            }

            // 设置相应样式，并阻止事件冒泡和默认事件
            this.renderer.setStyle(element, 'transform', `translateX(${this.distanceX}px)`);
            isScroll = false;
            moveEvent.preventDefault();
            moveEvent.stopPropagation();
            return false;
        });

        const touchEndFn = function () {
            this.isFocus = false;
            const endTime = Date.now();
            let distance = oldDistanceX - this.distanceX;
            // 当用户触摸完成后，时间小于 100ms，并且距离大于20，则认为是惯性触摸
            if (endTime - startTime < 100 && Math.abs(distance) > 20) {
                this.distanceX = distance < 0 ? 0 : -maxDistance;
            } else {
                // 否则按 50% 区分向左还是向右
                this.distanceX = this.distanceX > maxDistance / -2 ? 0 : -maxDistance;
            }
            this.renderer.setStyle(element, 'transition-duration', '');
            this.renderer.setStyle(element, 'transform', `translateX(${this.distanceX}px)`);
            unBindTouchCancelFn();
            unBindTouchMoveFn();
            unBindTouchEndFn();
        }.bind(this);

        unBindTouchEndFn = this.renderer.listen('document', 'touchend', touchEndFn);
        unBindTouchCancelFn = this.renderer.listen('document', 'touchcancel', touchEndFn);

        setTimeout(() => {
            if (isClick) {
                unBindTouchCancelFn();
                unBindTouchMoveFn();
                unBindTouchEndFn();
            }
        }, 100);
    }
}