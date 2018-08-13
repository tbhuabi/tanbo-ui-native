import { Directive, Optional, Self, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm, FormControl, FormGroup, FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';

@Directive({
  /*tslint:disable*/
  selector: '[uiSubmit]'
  /*tslint:enable*/
})
export class SubmitDirective implements OnInit, OnDestroy {

  @Output()
  uiSubmit = new EventEmitter<any>();

  private sub: Subscription;

  constructor(@Self() @Optional() private ngForm: NgForm) {
  }

  ngOnInit() {
    const group = this.ngForm.form;
    this.sub = this.ngForm.ngSubmit.subscribe((ev: Event) => {
      if (!this.ngForm.valid) {
        this.markAsTouched(group);
      } else {
        this.uiSubmit.emit(ev);
      }
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  private markAsTouched(group: FormGroup | FormArray) {
    Object.keys(group.controls).map((field) => {
      const control = group.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({onlySelf: true});
        control.markAsTouched({onlySelf: true});
      } else if (control instanceof FormGroup) {
        this.markAsTouched(control);
      }
    });
  }
}