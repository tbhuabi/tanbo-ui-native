import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModalModule } from '../modal/modal.module';

import { ActionSheetComponent } from './action-sheet/action-sheet.component';
import { ContentLoadingComponent } from './content-loading/content-loading.component';
import { FixedBarComponent } from './fixed-bar/fixed-bar.component';
import { LoadingComponent } from './loading/loading.component';

import { StopPropagationDirective } from './stop-propagation.directive';

@NgModule({
  imports: [
    CommonModule,
    UIModalModule
  ],
  declarations: [
    ActionSheetComponent,
    ContentLoadingComponent,
    FixedBarComponent,
    LoadingComponent,
    StopPropagationDirective
  ],
  exports: [
    ActionSheetComponent,
    ContentLoadingComponent,
    FixedBarComponent,
    LoadingComponent,
    StopPropagationDirective
  ]
})
export class UIOtherModule {
}