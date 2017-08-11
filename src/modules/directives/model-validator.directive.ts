import { Directive, Input, HostListener } from '@angular/core';
import { NgModel, FormControl } from '@angular/forms';
@Directive({
    selector: '[uiValidateModel]'
})
export class ModelValidatorDirective {
    @Input()
    uiValidateModel: NgModel;

    @HostListener('click') click() {
        if (this.uiValidateModel) {
            if (!this.uiValidateModel.valid) {
                let control: FormControl = this.uiValidateModel.formDirective.controls[this.uiValidateModel.name];
                control.markAsDirty();
                control.markAsTouched();
            }
        }
    }
}