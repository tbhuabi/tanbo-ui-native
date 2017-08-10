import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StopPropagationDirective } from './directives/stop-propagation.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        StopPropagationDirective
    ],
    exports: [
        StopPropagationDirective
    ]
})
export class UiDirectivesModule {
}