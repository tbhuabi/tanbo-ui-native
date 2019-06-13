import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIOtherModule } from '../other/other.module';

import { BackComponent } from './back/back.component';
import { RouterComponent } from './router/router.component';
import { TabComponent } from './tab/tab.component';
import { TabBarComponent } from './tab-bar/tab-bar.component';
import { TabBarItemComponent } from './tab-bar-item/tab-bar-item.component';
import { TabViewComponent } from './tab-view/tab-view.component';
import { TabViewItemComponent } from './tab-view-item/tab-view-item.component';
import { ViewComponent } from './view/view.component';

import { ComponentHostDirective } from './component-host.directive';

@NgModule({
  imports: [
    CommonModule,
    UIOtherModule
  ],
  declarations: [
    BackComponent,
    RouterComponent,
    TabComponent,
    TabBarComponent,
    TabBarItemComponent,
    TabViewComponent,
    TabViewItemComponent,
    ViewComponent,

    ComponentHostDirective
  ],
  exports: [
    BackComponent,
    RouterComponent,
    TabComponent,
    TabBarComponent,
    TabBarItemComponent,
    TabViewComponent,
    TabViewItemComponent,
    ViewComponent
  ]
})
export class UIRouterModule {
}