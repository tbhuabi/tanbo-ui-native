import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'ui-dialog',
    templateUrl: './dialog.component.html'
})
export class DialogComponent {
    @Input()
    set show(value: boolean) {
        this._show = value;
        if (value) {
            this.display = true;
        }
    }

    get show() {
        return this._show;
    }

    @Output()
    hide = new EventEmitter<void>();

    display: boolean = false;

    private _show: boolean = false;

    animationEnd() {
        this.hide.emit();
        this.display = false;
    }

    h() {
        if (!this.show) {
            this.display = false;
        }
    }
}