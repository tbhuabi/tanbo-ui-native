import { NgModule } from '@angular/core';

import { ListComponent } from './list/list.component';
import { ListHeaderComponent } from './list-header/list-header.component';
import { ListInnerComponent } from './list-inner/list-inner.component';
import { ListItemComponent } from './list-item/list-item.component';
import { ListOptionComponent } from './list-option/list-option.component';
import { ListSlidingComponent } from './list-sliding/list-sliding.component';
import { ListThumbnailComponent } from './list-thumbnail/list-thumbnail.component';

@NgModule({
  declarations: [
    ListComponent,
    ListHeaderComponent,
    ListInnerComponent,
    ListItemComponent,
    ListOptionComponent,
    ListSlidingComponent,
    ListThumbnailComponent
  ],
  exports: [
    ListComponent,
    ListHeaderComponent,
    ListInnerComponent,
    ListItemComponent,
    ListOptionComponent,
    ListSlidingComponent,
    ListThumbnailComponent
  ]
})
export class UIListModule {
}