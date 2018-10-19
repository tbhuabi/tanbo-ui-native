import { NgModule } from '@angular/core';

import { PanDirective } from './pan.directive';

@NgModule({
  declarations: [
    PanDirective
  ],
  exports: [
    PanDirective
  ]
})
export class UITouchModule {
}