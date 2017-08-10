import { Directive, Input, HostListener } from '@angular/core';
import { NgForm } from '@angular/forms';
@Directive({
    selector: '[uiValidateForm]'
})
export class FormValidatorDirective {
    @Input()
    uiValidateForm: NgForm;

    @HostListener('submit') submit() {
        if (this.uiValidateForm && !this.uiValidateForm.valid) {
            this.uiValidateForm.ngSubmit.isStopped = true;
            let controls = this.uiValidateForm.controls;
            for (let key in controls) {
                if (controls.hasOwnProperty(key)) {
                    let formControl = controls[key];
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