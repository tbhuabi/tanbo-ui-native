import { Component, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { inputAttrToBoolean } from '../helper';

@Component({
  selector: 'ui-input[type=checkbox]',
  templateUrl: './checkbox.component.html',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: CheckboxComponent,
    multi: true
  }]
})
export class CheckboxComponent implements ControlValueAccessor {
  @Output() uiChange = new EventEmitter<boolean>();
  @Input() checkedIcon: string = 'ui-icon-checkbox-checked';
  @Input() uncheckedIcon: string = 'ui-icon-checkbox-unchecked';
  @Input() name: string;
  @Input() text: string = '';
  @Input() value: string = '';
  @Input() forId: string;

  @Input()
  @HostBinding('class.ui-disabled')
  set disabled(isDisabled: any) {
    this._disabled = inputAttrToBoolean(isDisabled);
  }

  get disabled() {
    return this._disabled;
  }

  @Input()
  @HostBinding('class.ui-readonly')
  set readonly(isReadonly: any) {
    this._readonly = inputAttrToBoolean(isReadonly);
  }

  get readonly() {
    return this._readonly;
  }

  @Input()
  @HostBinding('class.ui-checked')
  set checked(isChecked: any) {
    this._checked = inputAttrToBoolean(isChecked);
  }

  get checked() {
    return this._checked;
  }

  private _disabled: boolean = false;
  private _readonly: boolean = false;
  private _checked: boolean = false;

  private onChange: (_: any) => any;
  private onTouched: (_: any) => any;

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
    this.uiChange.emit(this.checked);
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