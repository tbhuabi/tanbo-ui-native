import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RefresherComponent } from './refresher/refresher.component';
import { ScrollComponent } from './scroll/scroll.component';
import { ScrollTabComponent } from './scroll-tab/scroll-tab.component';
import { ScrollTabButtonComponent } from './scroll-tab-button/scroll-tab-button.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    RefresherComponent,
    ScrollComponent,
    ScrollTabComponent,
    ScrollTabButtonComponent
  ],
  exports: [
    RefresherComponent,
    ScrollComponent,
    ScrollTabComponent,
    ScrollTabButtonComponent
  ]
})
export class UIScrollModule {
}