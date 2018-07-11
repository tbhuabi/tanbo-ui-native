import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[ui-component-host]'
})
export class ComponentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}