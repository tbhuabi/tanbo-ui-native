import { Component, EventEmitter, HostBinding, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'ui-switch',
    templateUrl: './switch.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: SwitchComponent,
        multi: true
    }]
})
export class SwitchComponent implements ControlValueAccessor {
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
    @HostBinding('class.checked')
    set checked(isChecked: any) {
        this._checked = isChecked;
    }

    get checked() {
        let isChecked = (this as any).hasOwnProperty('_checked');
        return isChecked && this._checked !== false;
    }

    @Input()
    forId: string;
    @Input()
    value: string = '';
    @Input()
    name: string = '';
    @Output()
    change = new EventEmitter<boolean>();

    private onChange: (_: any) => void;
    private onTouched: (_: any) => void;
    private _disabled: boolean;
    private _readonly: boolean;
    private _checked: boolean;

    @HostListener('click')
    click() {
        if (this.disabled || this.readonly) {
            return;
        }
        this.checked = !this.checked;
        if (this.onChange) {
            this.onChange(this.checked);
        }
        if (this.onTouched) {
            this.onTouched(this.checked);
        }
        this.change.emit(this.checked);
    }

    writeValue(value: any) {
        this.checked = !!value;
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }
}