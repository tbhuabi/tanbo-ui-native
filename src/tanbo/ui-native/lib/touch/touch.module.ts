import { NgModule } from '@angular/core';

import { PanDirective } from './pan.directive';
import { PinchDirective } from './pinch.directive';

@NgModule({
  declarations: [
    PanDirective,
    PinchDirective,
  ],
  exports: [
    PanDirective,
    PinchDirective,
  ]
})
export class UITouchModule {
}