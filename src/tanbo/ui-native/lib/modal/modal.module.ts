import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogBaseComponent } from './dialog-base/dialog-base.component';
import { MaskComponent } from './mask/mask.component';
import { ToastComponent } from './toast/toast.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AlertComponent,
    DialogComponent,
    DialogBaseComponent,
    MaskComponent,
    ToastComponent
  ],
  exports: [
    AlertComponent,
    DialogComponent,
    DialogBaseComponent,
    MaskComponent,
    ToastComponent
  ]
})
export class UIModalModule {
}