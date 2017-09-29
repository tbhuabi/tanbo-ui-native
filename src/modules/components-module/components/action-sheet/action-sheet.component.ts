import { Component, HostBinding, Input } from '@angular/core';

@Component({
    selector: 'ui-action-sheet',
    templateUrl: './action-sheet.component.html'
})
export class ActionSheetComponent {
    @Input()
    @HostBinding('class.show')
    show: boolean = false;
}