import { Component, Input, Output, HostListener, EventEmitter } from '@angular/core';

import { InputType } from '../input-type';

@Component({
    selector: 'ui-input-checkbox',
    templateUrl: './checkbox.component.html'
})
export class CheckboxComponent implements InputType {
    @Input()
    set disabled(isDisabled: any) {
        this._disabled = isDisabled;
    }

    get disabled() {
        let isDisabled = (this as any).hasOwnProperty('_disabled');
        return isDisabled && this._disabled !== false;
    }

    @Input()
    set readonly(isReadonly: any) {
        this._readonly = isReadonly;
    }

    get readonly() {
        let isReadonly = (this as any).hasOwnProperty('_readonly');
        return isReadonly && this._readonly !== false;
    }

    @Input()
    set checked(isChecked: any) {
        this._checked = isChecked;
    }

    get checked() {
        let isChecked = (this as any).hasOwnProperty('_checked');
        return isChecked && this._checked !== false;
    }

    @Input()
    checkedIcon: string;
    @Input()
    uncheckedIcon: string;

    @Output()
    change = new EventEmitter<boolean>();

    private _disabled: boolean;
    private _readonly: boolean;
    private _checked: boolean;

    @HostListener('click') click() {
        if (this.disabled || this.readonly) {
            return;
        }
        this.change.emit(!this.checked);
    }

}