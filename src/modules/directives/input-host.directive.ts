import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
    selector: '[uiInputHost]'
})
export class InputHostDirective {
    constructor(public viewContainerRef: ViewContainerRef) {
    }
}