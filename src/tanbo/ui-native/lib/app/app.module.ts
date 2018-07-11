import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UIModalModule } from '../modal/modal.module';
import { UIRouterModule } from '../router/router.module';

import { AppComponent } from './app/app.component';

@NgModule({
  imports: [
    UIRouterModule,
    UIModalModule,
    CommonModule
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