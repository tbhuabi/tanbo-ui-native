import { ElementRef } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';

export abstract class TouchManager {
  touchSubscription: Subscription;
  abstract elementRef: ElementRef<any>;

  abstract touchStart(event: TouchEvent): any;

  abstract touchMove(event: TouchEvent, unListen: Function): any;

  abstract touchEnd(event: TouchEvent): any;

  init(points: number) {
    let isLock = false;
    this.touchSubscription = fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchstart')
      .pipe(filter(ev => {
        return ev.touches.length === points;
      }))
      .pipe(filter(() => !isLock), tap(() => {
        isLock = true;
      }))
      .subscribe(touchStartEvent => {
        this.touchStart(touchStartEvent);

        const unSubMove = fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchmove')
          .subscribe(touchMoveEvent => {
            this.touchMove(touchMoveEvent, unListen);
          });
        const unSubEnd = merge(fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchend'),
          fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchcancel'))
          .subscribe(ev => {
            unListen();
            this.touchEnd(ev);
          });

        const unListen = function () {
          isLock = false;
          unSubMove.unsubscribe();
          unSubEnd.unsubscribe();
        };
      });
  }

  destroy() {
    if (this.touchSubscription) {
      this.touchSubscription.unsubscribe();
    }
  }
}