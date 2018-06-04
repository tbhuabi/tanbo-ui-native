import { NgModule } from '@angular/core';

import { StopPropagationDirective } from './directives/stop-propagation.directive';

const directives: Array<any> = [
    StopPropagationDirective
];

@NgModule({
    declarations: directives,
    exports: directives
})
export class UIDirectivesModule {
}