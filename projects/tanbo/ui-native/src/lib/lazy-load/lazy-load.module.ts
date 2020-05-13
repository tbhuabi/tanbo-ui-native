import { NgModule } from '@angular/core';

import { LazyLoadDirective } from "@tanbo/ui-native/src/lib/lazy-load/lazy-load.directive";

@NgModule({
  declarations: [
    LazyLoadDirective
  ],
  exports: [
    LazyLoadDirective
  ]
})
export class UILazyLoadModule {
}