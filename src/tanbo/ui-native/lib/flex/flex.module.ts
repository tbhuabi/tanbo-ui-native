import { NgModule } from '@angular/core';

import { FlexComponent } from './flex/flex.component';
import { FlexItemComponent } from './flex-item/flex-item.component';

@NgModule({
  declarations: [
    FlexComponent,
    FlexItemComponent
  ],
  exports: [
    FlexComponent,
    FlexItemComponent
  ]
})
export class UIFlexModule {
}