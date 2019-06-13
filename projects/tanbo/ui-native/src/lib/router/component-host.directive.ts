import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[uiComponentHost]'
})
export class ComponentHostDirective {
  constructor(public viewContainerRef: ViewContainerRef) {
  }
}