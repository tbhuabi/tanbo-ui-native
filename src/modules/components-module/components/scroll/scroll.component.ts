import { Component, EventEmitter, HostListener, Output } from '@angular/core';

@Component({
    selector: 'ui-scroll',
    templateUrl: './scroll.component.html'
})
export class ScrollComponent {

    @Output()
    refresh = new EventEmitter<number>();

    @HostListener('scroll', ['$event'])
    scroll(event: any) {
        this.refresh.emit(event.srcElement.scrollTop);
    }
}