import { Component, Input } from '@angular/core';

@Component({
    selector: 'ui-action-sheet',
    templateUrl: './action-sheet.component.html'
})
export class ActionSheetComponent {
    @Input()
    set show(value: boolean) {
        clearTimeout(this.timer);
        if (value) {
            this._show = value;
            this.timer = setTimeout(() => {
                this.isPopUp = value;
            }, 20);
        } else {
            this.isPopUp = value;
            this.timer = setTimeout(() => {
                this._show = value;
            }, 300);
        }
    }

    get show() {
        return this._show;
    }
    isPopUp: boolean = false;

    private _show: boolean = false;
    private timer: any = null;
}