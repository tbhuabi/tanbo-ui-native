import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UITouchModule } from '../touch/touch.module';

import { Slide2Component } from './slide2/slide2.component';
import { Slide2ItemComponent } from './slide2-item/slide2-item.component';

@NgModule({
  imports: [
    CommonModule,
    UITouchModule
  ],
  declarations: [
    Slide2Component,
    Slide2ItemComponent
  ],
  exports: [
    Slide2Component,
    Slide2ItemComponent
  ]
})

export class UISlide2Module {}
