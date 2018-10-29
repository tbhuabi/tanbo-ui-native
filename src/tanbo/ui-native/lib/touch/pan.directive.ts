import { Directive, Output, EventEmitter, OnInit, ElementRef, OnDestroy } from '@angular/core';

import { UITouchEvent } from './helper';
import { TouchManager } from './touch-manager';

export type PanEventDirection = 'up' | 'down' | 'left' | 'right' | 'origin';

export interface PanEvent extends UITouchEvent {
  /** 第一次触发手势时，拖动的方向 */
  firstDirection: PanEventDirection;
  /** 拖动起点 x 轴相对屏幕左边的距离 */
  startX: number;
  /** 拖动起点 y 轴相对屏幕上边的距离 */
  startY: number;
  /** 拖动时 x 轴相对屏幕左边的距离 */
  moveX: number;
  /** 拖动时 y 轴相对屏幕上边的距离 */
  moveY: number;
  /** 拖动位置距离起点位置 x 轴的距离 */
  distanceX: number;
  /** 拖动位置距离起点位置 y 轴的距离 */
  distanceY: number;
  /** 多次拖动后，距离初始位置 x 轴的距离 */
  cumulativeDistanceX: number;
  /** 多次拖动后，距离初始位置 y 轴的距离 */
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
      durationTime: event.timeStamp - this.startTime,
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
    if (this.isFirst) {
      return;
    }
    this.uiPan.emit({
      durationTime: event.timeStamp - this.startTime,
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