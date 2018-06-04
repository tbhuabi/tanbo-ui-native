import { Component, ElementRef, HostListener, HostBinding, Input } from '@angular/core';

import { ScrollTabService } from '../scroll-tab/scroll-tab.service';

@Component({
    selector: 'ui-scroll-tab-button',
    templateUrl: './scroll-tab-button.component.html'
})
export class ScrollTabButtonComponent {
    @HostBinding('class.selected')
    @Input()
    selected: boolean = false;

    constructor(public elementRef: ElementRef,
                private scrollTabService: ScrollTabService) {
    }

    @HostListener('click')
    click() {
        this.scrollTabService.selected(this);
    }
}