import { Directive, Input, HostListener } from '@angular/core';
import { NgModel, FormControl } from '@angular/forms';

@Directive({
  selector: '[ui-validate-model]'
})
export class ModelValidatorDirective {
  @Input('ui-validate-model')
  uiValidateModel: NgModel;

  @HostListener('click')
  click() {
    if (this.uiValidateModel) {
      if (!this.uiValidateModel.valid) {
        const control: FormControl = this.uiValidateModel.formDirective.controls[this.uiValidateModel.name];
        control.markAsDirty();
        control.markAsTouched();
      }
    }
  }
}