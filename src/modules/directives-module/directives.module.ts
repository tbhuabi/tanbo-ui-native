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

import { PinchDirective } from './directives/pinch.directive';
import { PinchCancelDirective } from './directives/pinch-cancel.directive';
import { PinchEndDirective } from './directives/pinch-end.directive';
import { PinchInDirective } from './directives/pinch-in.directive';
import { PinchMoveDirective } from './directives/pinch-move.directive';
import { PinchOutDirective } from './directives/pinch-out.directive';
import { PinchStartDirective } from './directives/pinch-start.directive';

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
    StopPropagationDirective,

    PinchDirective,
    PinchCancelDirective,
    PinchEndDirective,
    PinchInDirective,
    PinchMoveDirective,
    PinchOutDirective,
    PinchStartDirective
];

@NgModule({
    declarations: directives,
    exports: directives
})
export class UIDirectivesModule {
}