import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UISlideModule } from '../slide/slide.module';
import { UITouchModule } from '../touch/touch.module';

import { ImageViewerComponent } from './image-viewer/image-viewer.component';

import { ImageViewableDirective } from './image-viewable.directive';

@NgModule({
  imports: [
    UISlideModule,
    CommonModule,
    UITouchModule
  ],
  declarations: [
    ImageViewerComponent,
    ImageViewableDirective
  ],
  exports: [
    ImageViewerComponent,
    ImageViewableDirective
  ]
})
export class UIImageViewerModule {
}