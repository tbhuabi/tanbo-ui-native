import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UITouchModule } from '../touch/touch.module';
import { SlideComponent } from './slide/slide.component';
import { SlideItemComponent } from './slide-item/slide-item.component';

@NgModule({
  imports: [
    CommonModule,
    UITouchModule
  ],
  declarations: [
    SlideComponent,
    SlideItemComponent
  ],
  exports: [
    SlideComponent,
    SlideItemComponent
  ]
})
export class UISlideModule {
}