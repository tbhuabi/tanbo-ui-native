import { ElementRef } from '@angular/core';
import { fromEvent, merge } from 'rxjs';
import { filter, tap, debounceTime } from 'rxjs/operators';

export abstract class TouchManager {
  abstract elementRef: ElementRef<any>;

  abstract touchStart(event: TouchEvent): any;

  abstract touchMove(event: TouchEvent, unListen: Function): any;

  abstract touchEnd(event: TouchEvent): any;

  init(points: number) {
    let isLock = false;
    fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchstart')
      .pipe(debounceTime(200), filter(() => !isLock), tap(() => {
        isLock = true;
      }), filter(ev => {
        return ev.touches.length === points;
      }))
      .subscribe(touchStartEvent => {
        const eventPoints = touchStartEvent.touches.length;
        if (points === eventPoints) {
          this.touchStart(touchStartEvent);
        }
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
}