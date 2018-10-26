import { Directive, Output, EventEmitter, OnInit, ElementRef, OnDestroy } from '@angular/core';

import { UITouchEvent } from './helper';
import { TouchManager } from './touch-manager';

export type PanEventDirection = 'up' | 'down' | 'left' | 'right' | 'origin';

export interface PanEvent extends UITouchEvent {
  firstDirection: PanEventDirection;
  startX: number;
  startY: number;
  moveX: number;
  moveY: number;
  distanceX: number;
  distanceY: number;
  cumulativeDistanceX: number;
  cumulativeDistanceY: number;
}

@Directive({
  selector: '[uiPan]'
})
export class PanDirective extends TouchManager implements OnInit, OnDestroy {
  @Output() uiPan = new EventEmitter<PanEvent>();
  private cumulativeDistanceX = 0;
  private cumulativeDistanceY = 0;

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

  private startTime: number;

  constructor(public elementRef: ElementRef) {
    super();
  }

  ngOnInit() {
    super.init(1);
  }

  ngOnDestroy() {
    super.destroy();
  }

  touchStart(event: TouchEvent) {
    const startPoint = event.touches[0];
    this.startX = startPoint.clientX;
    this.startY = startPoint.clientY;

    this.moveX = this.startX;
    this.moveY = this.startY;

    this.distanceX = 0;
    this.distanceY = 0;

    this.oldMoveX = 0;
    this.oldMoveY = 0;

    this.direction = 'origin';
    this.isFirst = true;
    this.startTime = event.timeStamp;
  }

  touchMove(event: TouchEvent, unListen: Function) {
    const point = event.touches[0];
    this.oldMoveX = this.moveX;
    this.oldMoveY = this.moveY;
    this.moveX = point.clientX;
    this.moveY = point.clientY;

    this.distanceX = this.moveX - this.startX;
    this.distanceY = this.moveY - this.startY;

    if (this.isFirst) {
      if (Math.abs(this.distanceX) > Math.abs(this.distanceY)) {
        this.direction = this.distanceX > 0 ? 'right' : 'left';
      } else {
        this.direction = this.distanceY > 0 ? 'down' : 'up';
      }
    }

    this.cumulativeDistanceX += this.moveX - this.oldMoveX;
    this.cumulativeDistanceY += this.moveY - this.oldMoveY;
    this.uiPan.emit({
      time: event.timeStamp - this.startTime,
      first: this.isFirst,
      eventName: 'uiPan',
      firstDirection: this.direction,
      startX: this.startX,
      startY: this.startY,
      moveX: this.moveX,
      moveY: this.moveY,
      distanceX: this.distanceX,
      distanceY: this.distanceY,
      cumulativeDistanceX: this.cumulativeDistanceX,
      cumulativeDistanceY: this.cumulativeDistanceY,
      srcEvent: event,
      type: 'touchmove',
      stop: unListen,
      resetCumulative: () => {
        this.reset();
      }
    });

    this.isFirst = false;
  }

  touchEnd(event: TouchEvent) {
    this.uiPan.emit({
      time: event.timeStamp - this.startTime,
      first: false,
      eventName: 'uiPan',
      firstDirection: this.direction,
      startX: this.startX,
      startY: this.startY,
      moveX: this.moveX,
      moveY: this.moveY,
      distanceX: this.distanceX,
      distanceY: this.distanceY,
      cumulativeDistanceX: this.cumulativeDistanceX,
      cumulativeDistanceY: this.cumulativeDistanceY,
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
    this.cumulativeDistanceY = 0;
    this.cumulativeDistanceX = 0;
  }
}