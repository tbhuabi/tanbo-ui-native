import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[uiPinch]'
})
export class PinchDirective {
  @Output()
  uiPinch = new EventEmitter();
  @HostListener('touchstart', ['$event'])
  touchStart(ev: TouchEvent) {
  }
}