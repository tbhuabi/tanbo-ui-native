import { Component, HostBinding, Input } from '@angular/core';
import { ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-action-sheet',
    templateUrl: './action-sheet.component.html'
})
export class ActionSheetComponent {
    @Input()
    @HostBinding('class.show')
    set show(value: boolean) {
        this._show = value;
        if (value) {
            this.viewStateService.isShowPopover(value);
        }
    }

    get show() {
        return this._show;
    }

    private _show: boolean = false;

    constructor(private viewStateService: ViewStateService) {
    }

    hide() {
        this.viewStateService.isShowPopover(false);
    }
}