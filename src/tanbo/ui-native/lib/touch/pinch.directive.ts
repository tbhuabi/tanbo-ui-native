import { Directive, EventEmitter, Output, ElementRef, OnInit, OnDestroy } from '@angular/core';

import { UITouchEvent } from './helper';
import { TouchManager } from './touch-manager';

export interface PinchEvent extends UITouchEvent {
  startX: number;
  startY: number;
  moveX: number;
  moveY: number;
  distanceX: number;
  distanceY: number;
  cumulativeDistanceX: number;
  cumulativeDistanceY: number;
  cumulativeScale: number;
  scale: number;
}

@Directive({
  selector: '[uiPinch]'
})
export class PinchDirective extends TouchManager implements OnInit, OnDestroy {
  @Output() uiPinch = new EventEmitter<PinchEvent>();

  private cumulativeScale = 1;
  private scale = 1;
  private oldScale = 1;
  private startDistance: number;

  private startX: number;
  private startY: number;

  private moveX: number;
  private moveY: number;
  private distanceX: number = 0;
  private distanceY: number = 0;
  private cumulativeDistanceX: number = 0;
  private cumulativeDistanceY: number = 0;

  private oldMoveX: number = 0;
  private oldMoveY: number = 0;

  private isFirst = true;
  private startTime: number;

  constructor(public elementRef: ElementRef) {
    super();
  }

  ngOnInit() {
    super.init(2);
  }

  ngOnDestroy() {
    super.destroy();
  }

  touchStart(event: TouchEvent) {
    const p1 = event.touches[0];
    const p2 = event.touches[1];

    const centerPoint = this.getCenterPoint(p1, p2);

    this.startX = centerPoint.x;
    this.startY = centerPoint.y;

    this.moveX = this.startX;
    this.moveY = this.startY;

    this.startDistance = this.getChordLength(p1, p2);
    this.scale = 1;
    this.isFirst = true;
    this.startTime = event.timeStamp;
    event.preventDefault();
  }

  touchMove(event: TouchEvent, unListen: Function) {
    const p1 = event.touches[0];
    const p2 = event.touches[1];
    const centerPoint = this.getCenterPoint(p1, p2);

    this.oldMoveX = this.moveX;
    this.oldMoveY = this.moveY;
    this.moveX = centerPoint.x;
    this.moveY = centerPoint.y;

    this.distanceX = this.moveX - this.startX;
    this.distanceY = this.moveY - this.startY;

    this.cumulativeDistanceX += this.moveX - this.oldMoveX;
    this.cumulativeDistanceY += this.moveY - this.oldMoveY;

    const moveArea = this.getChordLength(p1, p2);

    this.oldScale = this.scale;
    this.scale = moveArea / this.startDistance;

    this.uiPinch.emit({
      time: event.timeStamp - this.startTime,
      first: this.isFirst,
      eventName: 'uiPinch',
      startX: this.startX,
      startY: this.startY,
      moveX: this.moveX,
      moveY: this.moveY,
      distanceX: this.distanceX,
      distanceY: this.distanceY,
      cumulativeDistanceX: this.cumulativeDistanceX,
      cumulativeDistanceY: this.cumulativeDistanceY,
      stop: unListen,
      srcEvent: event,
      type: 'touchmove',
      resetCumulative: () => {
        this.cumulativeScale = 1;
        this.cumulativeDistanceX = 0;
        this.cumulativeDistanceY = 0;
      },
      scale: this.scale,
      cumulativeScale: this.cumulativeScale * this.scale
    });
    this.isFirst = false;
  }

  touchEnd(event: TouchEvent) {
    this.cumulativeScale = this.cumulativeScale * this.scale;

    this.uiPinch.emit({
      time: event.timeStamp - this.startTime,
      first: false,
      eventName: 'uiPinch',
      startX: this.startX,
      startY: this.startY,
      moveX: this.moveX,
      moveY: this.moveY,
      distanceX: this.distanceX,
      distanceY: this.distanceY,
      cumulativeDistanceX: this.cumulativeDistanceX,
      cumulativeDistanceY: this.cumulativeDistanceY,
      /*tslint:disable*/
      stop: function noop() {

      },
      /*tslint:enable*/
      srcEvent: event,
      type: 'touchend',
      resetCumulative: () => {
        this.cumulativeScale = 1;
      },
      scale: this.scale,
      cumulativeScale: this.cumulativeScale
    });
  }

  private getChordLength(p1: Touch, p2: Touch): number {
    const x = Math.abs(p1.clientX - p2.clientX);
    const y = Math.abs(p1.clientY - p2.clientY);

    return Math.sqrt(x * x + y * y);
  }

  private getCenterPoint(p1: Touch, p2: Touch) {
    return {
      x: (p1.clientX + p2.clientX) / 2,
      y: (p1.clientY + p2.clientY) / 2
    };
  }
}