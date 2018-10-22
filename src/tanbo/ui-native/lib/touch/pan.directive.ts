import { Directive, Output, EventEmitter, OnInit, ElementRef } from '@angular/core';

import { PanEvent, PanEventDirection } from './helper';
import { Touch } from './touch';

@Directive({
  selector: '[uiPan]'
})
export class PanDirective extends Touch implements OnInit {
  @Output() uiPan = new EventEmitter<PanEvent>();
  private cumulativeX = 0;
  private cumulativeY = 0;

  private startX: number;
  private startY: number;

  private moveX: number;
  private moveY: number;

  private distanceX = 0;
  private distanceY = 0;

  private oldMoveX = 0;
  private oldMoveY = 0;

  private direction: PanEventDirection = 'origin';
  private isFirst = true;

  constructor(public elementRef: ElementRef) {
    super();
  }

  ngOnInit() {
    super.init(1);
  }

  touchStart(event: TouchEvent) {
    const startPoint = event.touches[0];
    this.startX = startPoint.pageX;
    this.startY = startPoint.pageY;

    this.moveX = this.startX;
    this.moveY = this.startY;

    this.distanceX = 0;
    this.distanceY = 0;

    this.oldMoveX = 0;
    this.oldMoveY = 0;

    this.direction = 'origin';
    this.isFirst = true;
  }

  touchMove(moveEvent: TouchEvent, unListen: Function) {
    const movePoint = moveEvent.touches[0];
    this.oldMoveX = this.moveX;
    this.oldMoveY = this.moveY;
    this.moveX = movePoint.pageX;
    this.moveY = movePoint.pageY;

    this.distanceX = this.moveX - this.startX;
    this.distanceY = this.moveY - this.startY;

    if (this.isFirst) {
      this.isFirst = false;
      if (Math.abs(this.distanceX) > Math.abs(this.distanceY)) {
        this.direction = this.distanceX > 0 ? 'right' : 'left';
      } else {
        this.direction = this.distanceY > 0 ? 'down' : 'up';
      }
    }

    this.cumulativeX += this.moveX - this.oldMoveX;
    this.cumulativeY += this.moveY - this.oldMoveY;
    this.uiPan.emit({
      eventName: 'uiPan',
      firstDirection: this.direction,
      startX: this.startX,
      startY: this.startY,
      moveX: this.moveX,
      moveY: this.moveY,
      distanceX: this.distanceX,
      distanceY: this.distanceY,
      cumulativeX: this.cumulativeX,
      cumulativeY: this.cumulativeY,
      srcEvent: moveEvent,
      type: 'touchmove',
      stop: unListen,
      resetCumulative: () => {
        this.reset();
      }
    });
  }

  touchEnd(event: TouchEvent) {
    this.uiPan.emit({
      eventName: 'uiPan',
      firstDirection: this.direction,
      startX: this.startX,
      startY: this.startY,
      moveX: this.moveX,
      moveY: this.moveY,
      distanceX: this.distanceX,
      distanceY: this.distanceY,
      cumulativeX: this.cumulativeX,
      cumulativeY: this.cumulativeY,
      srcEvent: event,
      type: 'touchend',
      /*tslint:disable*/
      stop: function noop() {
      },
      /*tslint:enable*/
      resetCumulative: () => {
        this.reset();
      }
    });
  }

  reset() {
    this.cumulativeY = 0;
    this.cumulativeX = 0;
  }
}