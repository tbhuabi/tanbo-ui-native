import { Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';

import { ListEventService } from '../list-item/list-event.service';

@Component({
    selector: 'ui-list-sliding',
    templateUrl: './list-sliding.component.html'
})
export class ListSlidingComponent implements OnInit, OnDestroy {
    private sub: Subscription;
    private distanceX: number = 0;
    private refs: Array<ElementRef> = [];

    constructor(private listEventService: ListEventService,
                private renderer: Renderer2) {
    }

    ngOnInit() {
        this.sub = this.listEventService.listOptions$.subscribe((elementRef: ElementRef) => {
            this.refs.push(elementRef);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('touchstart', ['$event'])
    touchstart(event: any) {
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

        this.renderer.setStyle(element, 'transition-duration', '0s');

        let unBindTouchEndFn: () => void;
        let unBindTouchMoveFn = this.renderer.listen('document', 'touchmove', (moveEvent: any) => {
            isClick = false;
            const newTouchPoint = moveEvent.touches[0];

            const moveX = newTouchPoint.pageX;
            const moveY = newTouchPoint.pageY;

            if (isScroll && Math.abs(moveX - startX) < Math.abs(moveY - startY)) {
                unBindTouchMoveFn();
                unBindTouchEndFn();
                this.listEventService.publishEvent(false);
                return;
            }

            this.distanceX = moveX - startX + oldDistanceX;
            if (this.distanceX > 0) {
                this.distanceX = 0;
            }
            if (this.distanceX < -maxDistance) {
                this.distanceX = -maxDistance;
            }

            this.renderer.setStyle(element, 'transform', `translateX(${this.distanceX}px)`);
            isScroll = false;
            moveEvent.preventDefault();
            moveEvent.stopPropagation();
            return false;
        });

        unBindTouchEndFn = this.renderer.listen('document', 'touchend', () => {
            const endTime = Date.now();
            let distance = oldDistanceX - this.distanceX;
            if (endTime - startTime < 100 && Math.abs(distance) > 20) {
                this.distanceX = distance < 0 ? 0 : -maxDistance;
            } else {
                this.distanceX = this.distanceX > maxDistance / -2 ? 0 : -maxDistance;
            }
            this.renderer.setStyle(element, 'transition-duration', '');
            this.renderer.setStyle(element, 'transform', `translateX(${this.distanceX}px)`);
            this.listEventService.publishEvent(false);
            unBindTouchMoveFn();
            unBindTouchEndFn();
        });

        setTimeout(() => {
            if (isClick) {
                this.listEventService.publishEvent(isClick);
                unBindTouchMoveFn();
                unBindTouchEndFn();
            }
        }, 100);
    }
}