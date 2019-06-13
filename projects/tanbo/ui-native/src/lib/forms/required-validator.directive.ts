import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator } from '@angular/forms';

@Directive({
  /* tslint:disable */
  selector: 'ui-input[required][type=checkbox]',
  /* tslint:enable */
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: CheckboxRequiredValidator,
    multi: true
  }]
})
export class CheckboxRequiredValidator implements Validator {
  private _required: boolean;
  private _onChange: () => void;

  @Input()
  get required(): boolean | string {
    return this._required;
  }

  set required(value: boolean | string) {
    this._required = value !== false && value !== null;
    if (this._onChange) {
      this._onChange();
    }
  }

  validate(c: AbstractControl): ValidationErrors | null {
    if (this.required) {
      return c.value === true ? null : {'required': true};
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}

@Directive({
  /* tslint:disable */
  selector: 'ui-switch[required]',
  /* tslint:enable */
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: SwitchRequiredValidator,
    multi: true
  }]
})
export class SwitchRequiredValidator implements Validator {
  private _required: boolean;
  private _onChange: () => void;

  @Input()
  get required(): boolean | string {
    return this._required;
  }

  set required(value: boolean | string) {
    this._required = value !== false && value !== null;
    if (this._onChange) {
      this._onChange();
    }
  }

  validate(c: AbstractControl): ValidationErrors | null {
    if (this.required) {
      return c.value === true ? null : {'required': true};
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}

@Directive({
  /* tslint:disable */
  selector: 'ui-input[required][type=radio]',
  /* tslint:enable */
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: RadioRequiredValidator,
    multi: true
  }]
})
export class RadioRequiredValidator implements Validator {
  private _required: boolean;
  private _onChange: () => void;

  @Input()
  get required(): boolean | string {
    return this._required;
  }

  set required(value: boolean | string) {
    this._required = value !== false && value !== null;
    if (this._onChange) {
      this._onChange();
    }
  }

  validate(c: AbstractControl): ValidationErrors | null {
    if (this.required) {
      return c.value !== '' && c.value !== undefined && c.value !== null ? null : {'required': true};
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}

@Directive({
  /* tslint:disable */
  selector: 'ui-select[required]',
  /* tslint:enable */
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: SelectRequiredValidator,
    multi: true
  }]
})
export class SelectRequiredValidator implements Validator {
  private _required: boolean;
  private _onChange: () => void;

  @Input()
  get required(): boolean | string {
    return this._required;
  }

  set required(value: boolean | string) {
    this._required = value !== false && value !== null;
    if (this._onChange) {
      this._onChange();
    }
  }

  validate(c: AbstractControl): ValidationErrors | null {
    if (this.required) {
      return c.value !== '' && c.value !== undefined && c.value !== null ? null : {'required': true};
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}

@Directive({
  /* tslint:disable */
  selector: 'ui-input[type=date][required]',
  /* tslint:enable */
  providers: [{
    provide: NG_VALIDATORS,
    useExisting: DateRequiredValidator,
    multi: true
  }]
})
export class DateRequiredValidator implements Validator {
  private _required: boolean;
  private _onChange: () => void;

  @Input()
  get required(): boolean | string {
    return this._required;
  }

  set required(value: boolean | string) {
    this._required = value !== false && value !== null;
    if (this._onChange) {
      this._onChange();
    }
  }

  validate(c: AbstractControl): ValidationErrors | null {
    if (this.required) {
      return c.value !== '' && c.value !== undefined && c.value !== null ? null : {'required': true};
    }
    return null;
  }

  registerOnValidatorChange(fn: () => void): void {
    this._onChange = fn;
  }
}