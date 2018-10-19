import { Directive, Renderer2, Output, EventEmitter, HostListener } from '@angular/core';

import { PanEvent, PanEventDirection } from './helper';

@Directive({
  selector: '[uiPan]'
})
export class PanDirective {
  @Output() uiPan = new EventEmitter<PanEvent>();

  private cumulativeX = 0;
  private cumulativeY = 0;

  constructor(private renderer: Renderer2) {
  }

  @HostListener('touchstart', ['$event'])
  touchStart(event: TouchEvent) {
    const startPoint = event.touches[0];
    const startX = startPoint.pageX;
    const startY = startPoint.pageY;

    let moveX = startX;
    let moveY = startY;

    let distanceX = 0;
    let distanceY = 0;

    let oldMoveX = 0;
    let oldMoveY = 0;

    let direction: PanEventDirection = 'origin';

    const reset = () => {
      this.cumulativeY = 0;
      this.cumulativeX = 0;
    };
    const unBindFn = (endEvent: TouchEvent) => {
      stopFn();
      if (isFirst) {
        return;
      }
      this.uiPan.emit({
        firstDirection: direction,
        startX,
        startY,
        moveX,
        moveY,
        distanceX,
        distanceY,
        cumulativeX: this.cumulativeX,
        cumulativeY: this.cumulativeY,
        srcEvent: endEvent,
        type: 'touchend',
        stop: function noop() {
        },
        resetCumulative: reset
      });
    };

    function stopFn() {
      unBindTouchMoveFn();
      unBindTouchEndFn();
      unBindTouchCancelFn();
    }

    let isFirst = true;

    const unBindTouchMoveFn = this.renderer.listen(event.srcElement, 'touchmove', (moveEvent: TouchEvent) => {
      const movePoint = moveEvent.touches[0];
      oldMoveX = moveX;
      oldMoveY = moveY;
      moveX = movePoint.pageX;
      moveY = movePoint.pageY;

      distanceX = moveX - startX;
      distanceY = moveY - startY;

      if (isFirst) {
        isFirst = false;
        if (Math.abs(distanceX) > Math.abs(distanceY)) {
          direction = distanceX > 0 ? 'right' : 'left';
        } else {
          direction = distanceY > 0 ? 'down' : 'up';
        }
      }

      this.cumulativeX += moveX - oldMoveX;
      this.cumulativeY += moveY - oldMoveY;
      this.uiPan.emit({
        firstDirection: direction,
        startX,
        startY,
        moveX,
        moveY,
        distanceX,
        distanceY,
        cumulativeX: this.cumulativeX,
        cumulativeY: this.cumulativeY,
        srcEvent: moveEvent,
        type: 'touching',
        stop: stopFn,
        resetCumulative: reset
      });
    });

    const unBindTouchEndFn = this.renderer.listen(event.srcElement, 'touchend', unBindFn);
    const unBindTouchCancelFn = this.renderer.listen(event.srcElement, 'touchcancel', unBindFn);
  }
}