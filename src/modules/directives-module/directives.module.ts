import { NgModule } from '@angular/core';

import { PanDirective } from './directives/pan.directive';
import { PanCancelDirective } from './directives/pan-cancel.directive';
import { PanDownDirective } from './directives/pan-down.directive';
import { PanEndDirective } from './directives/pan-end.directive';
import { PanLeftDirective } from './directives/pan-left.directive';
import { PanMoveDirective } from './directives/pan-move.directive';
import { PanRightDirective } from './directives/pan-right.directive';
import { PanStartDirective } from './directives/pan-start.directive';
import { PanUpDirective } from './directives/pan-up.directive';
import { StopPropagationDirective } from './directives/stop-propagation.directive';

const directives: Array<any> = [
    PanDirective,
    PanUpDirective,
    PanCancelDirective,
    PanDownDirective,
    PanEndDirective,
    PanLeftDirective,
    PanMoveDirective,
    PanRightDirective,
    PanStartDirective,
    PanUpDirective,
    StopPropagationDirective
];

@NgModule({
    declarations: directives,
    exports: directives
})
export class UIDirectivesModule {
}