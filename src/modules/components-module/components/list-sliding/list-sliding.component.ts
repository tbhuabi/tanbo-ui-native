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
    touchStart(event: any) {
        const touchPoint = event.touches[0];

        const startX = touchPoint.pageX;

        const element = event.target;
        const oldDistanceX = this.distanceX;

        let maxDistance = 0;

        this.refs.forEach((item: ElementRef) => {
            maxDistance += item.nativeElement.offsetWidth;
        });

        let isClick = true;

        setTimeout(() => {
            this.listEventService.publishEvent(isClick);
        }, 100);

        const unBindTouchMoveFn = this.renderer.listen(element, 'touchmove', (moveEvent: any) => {
            isClick = false;
            const newTouchPoint = moveEvent.touches[0];

            const moveX = newTouchPoint.pageX;

            this.distanceX = moveX - startX + oldDistanceX;

            if (this.distanceX > 0) {
                this.distanceX = 0;
            }
            if (this.distanceX < -maxDistance) {
                this.distanceX = -maxDistance;
            }

            this.renderer.setStyle(element, 'transform', 'translateX(' + this.distanceX + 'px)');

            // if (Math.abs(distanceX) >= 100) {
            //     console.log(333);
            // }
        });

        const unBindTouchEndFn = this.renderer.listen(element, 'touchend', () => {
            this.listEventService.publishEvent(false);
            unBindTouchMoveFn();
            unBindTouchEndFn();
        });
    }
}