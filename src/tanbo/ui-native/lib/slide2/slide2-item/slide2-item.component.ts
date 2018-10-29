import { Component, HostBinding } from '@angular/core';

@Component({
  selector: 'ui-slide2-item',
  templateUrl: './slide2-item.component.html'
})
export class Slide2ItemComponent {
  @HostBinding('class.ui-in')
  get isIn() {
    return this.state === 'in';
  }
  @HostBinding('class.ui-out')
  get isOut() {
    return this.state === 'out';
  }

  state: string = '';

  @HostBinding('style.transform')
  @HostBinding('style.webkitTransform')
  get transform() {
    return `translateX(${this.animateProgress * 100}%)`;
  }

  animateProgress: number = 0;
}