import { Component, Output, EventEmitter, HostListener } from '@angular/core';
@Component({
    selector: 'ui-drop-down-fixed',
    templateUrl: './drop-down-fixed.component.html'
})
export class DropDownFixedComponent {
    @Output()
    trigger = new EventEmitter();

    @HostListener('click') click() {
        this.trigger.emit();
    }
}