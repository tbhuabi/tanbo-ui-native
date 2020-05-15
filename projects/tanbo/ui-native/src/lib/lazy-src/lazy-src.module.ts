import { NgModule } from '@angular/core';

import { LazySrcDirective } from "@tanbo/ui-native/src/lib/lazy-src/lazy-src.directive";

@NgModule({
  declarations: [
    LazySrcDirective
  ],
  exports: [
    LazySrcDirective
  ]
})
export class UILazySrcModule {
}