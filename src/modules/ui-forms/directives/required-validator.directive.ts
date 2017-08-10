import { Directive, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl, ValidationErrors, Validator } from '@angular/forms';
@Directive({
    /* tslint:disable */
    selector: 'ui-input[required][type=checkbox]',
    /* tslint:enable */
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: UiCheckboxRequiredValidatorDirective,
        multi: true
    }]
})
export class UiCheckboxRequiredValidatorDirective implements Validator {
    private _required: boolean;
    private _onChange: () => void;

    @Input()
    get required(): boolean | string {
        return this._required;
    }

    set required(value: boolean | string) {
        this._required = value !== false && value !== null;
        if (this._onChange) this._onChange();
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