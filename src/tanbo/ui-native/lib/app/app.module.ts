import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModalModule } from '../modal/modal.module';
import { UIRouterModule } from '../router/router.module';
import { UIImageViewerModule } from '../image-viewer/image-viewer.module';

import { AppComponent } from './app/app.component';

@NgModule({
  imports: [
    UIRouterModule,
    UIModalModule,
    CommonModule,
    UIImageViewerModule
  ],
  declarations: [
    AppComponent
  ],
  exports: [
    AppComponent
  ]
})
export class UIAppModule {
}