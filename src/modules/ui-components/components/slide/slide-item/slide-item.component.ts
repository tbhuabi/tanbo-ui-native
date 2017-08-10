import { Component, HostBinding, Input } from '@angular/core';
@Component({
    selector: 'ui-slide-item',
    templateUrl: './slide-item.component.html'
})
export class SlideItemComponent {
    @HostBinding('class.active')
    @Input()
    active: boolean = false;
}