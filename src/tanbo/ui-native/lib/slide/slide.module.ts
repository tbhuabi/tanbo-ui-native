import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SlideComponent } from './slide/slide.component';
import { SlideItemComponent } from './slide-item/slide-item.component';

@NgModule({
  imports: [
    CommonModule
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