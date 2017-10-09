import { NgModule } from '@angular/core';

import { StopPropagationDirective } from './directives/stop-propagation.directive';

@NgModule({
    declarations: [
        StopPropagationDirective
    ],
    exports: [
        StopPropagationDirective
    ]
})
export class UIDirectivesModule {
}