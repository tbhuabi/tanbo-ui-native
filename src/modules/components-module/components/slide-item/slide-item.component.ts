import { Component, HostBinding } from '@angular/core';

@Component({
    selector: 'ui-slide-item',
    templateUrl: './slide-item.component.html'
})
export class SlideItemComponent {
    @HostBinding('class.in')
    get isIn() {
        return this.state === 'in';
    }
    @HostBinding('class.out')
    get isOut() {
        return this.state === 'out';
    }

    state: string = '';

    @HostBinding('style.transform')
    get transform() {
        return `translateX(${this.animateProgress * 100}%)`;
    }

    animateProgress: number = 0;
}