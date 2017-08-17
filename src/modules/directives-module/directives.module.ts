import { NgModule } from '@angular/core';

import { PanDirective } from './directives/pan.directive';
import { StopPropagationDirective } from './directives/stop-propagation.directive';

@NgModule({
    declarations: [
        StopPropagationDirective,
        PanDirective
    ],
    exports: [
        StopPropagationDirective,
        PanDirective
    ]
})
export class UiDirectivesModule {
}