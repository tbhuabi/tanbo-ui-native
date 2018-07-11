import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UINativeModule } from '../../tanbo/ui-native/public_api';

import { routes } from './lazy.routing';

import { TestComponent } from './test/test.component';

@NgModule({
  imports: [
    UINativeModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    TestComponent
  ]
})
export class LazyModule {

}