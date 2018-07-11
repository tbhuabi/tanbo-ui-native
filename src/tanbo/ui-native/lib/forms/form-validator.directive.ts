import { Directive, Input, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';

@Directive({
  selector: '[ui-validate-form]'
})
export class FormValidatorDirective {
  @Input()
  uiValidateForm: NgForm;

  @HostListener('submit')
  submit() {
    if (this.uiValidateForm && !this.uiValidateForm.valid) {
      this.uiValidateForm.ngSubmit.isStopped = true;
      const controls = this.uiValidateForm.controls;
      for (const key in controls) {
        if (controls.hasOwnProperty(key)) {
          const formControl = controls[key];
          formControl.markAsDirty();
          formControl.markAsTouched();
        }
      }
      return false;
    } else {
      this.uiValidateForm.ngSubmit.isStopped = false;
    }
  }
}