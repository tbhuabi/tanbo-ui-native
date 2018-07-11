import { NgModule } from '@angular/core';

import { SegmentComponent } from './segment/segment.component';
import { SegmentButtonComponent } from './segment-button/segment-button.component';

@NgModule({
  declarations: [
    SegmentComponent,
    SegmentButtonComponent
  ],
  exports: [
    SegmentComponent,
    SegmentButtonComponent
  ]
})
export class UISegmentModule {
}