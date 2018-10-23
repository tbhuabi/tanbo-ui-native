import { Directive, EventEmitter, Output, ElementRef, OnInit } from '@angular/core';

import { UITouchEvent } from './helper';
import { TouchManager } from './touch-manager';

export interface PinchEvent extends UITouchEvent {
  scale: number;
  cumulativeScale: number;
}

@Directive({
  selector: '[uiPinch]'
})
export class PinchDirective extends TouchManager implements OnInit {
  @Output() uiPinch = new EventEmitter<PinchEvent>();

  private cumulative = 1;
  private scale = 1;
  private oldScale = 1;
  private startArea: number;

  constructor(public elementRef: ElementRef) {
    super();
  }

  ngOnInit() {
    super.init(2);
  }

  touchStart(event: TouchEvent) {
    this.startArea = this.getChordLength(event);
    this.scale = 1;
  }

  touchMove(event: TouchEvent, unListen: Function) {
    const moveArea = this.getChordLength(event);

    this.oldScale = this.scale;
    this.scale = moveArea / this.startArea;

    this.uiPinch.emit({
      eventName: 'uiPinch',
      stop: unListen,
      srcEvent: event,
      type: 'touchmove',
      resetCumulative: () => {
        this.cumulative = 1;
      },
      scale: this.scale,
      cumulativeScale: this.cumulative * this.scale
    });
  }

  touchEnd(event: TouchEvent) {
    this.cumulative = this.cumulative * this.scale;

    this.uiPinch.emit({
      eventName: 'uiPinch',
      /*tslint:disable*/
      stop: function noop() {

      },
      /*tslint:enable*/
      srcEvent: event,
      type: 'touchend',
      resetCumulative: () => {
        this.cumulative = 1;
      },
      scale: this.scale,
      cumulativeScale: this.cumulative
    });
  }

  private getChordLength(event: TouchEvent): number {
    const p1 = event.touches[0];
    const p2 = event.touches[1];
    const x = Math.abs(p1.pageX - p2.pageX);
    const y = Math.abs(p1.pageY - p2.pageY);

    return Math.sqrt(x * x + y * y);
  }
}