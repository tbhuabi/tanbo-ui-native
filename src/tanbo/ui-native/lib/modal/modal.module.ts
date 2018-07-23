import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AlertComponent } from './alert/alert.component';
import { DialogComponent } from './dialog/dialog.component';
import { DialogBaseComponent } from './dialog-base/dialog-base.component';
import { MaskComponent } from './mask/mask.component';
import { ModalComponent } from './modal/modal.component';
import { ModalBaseComponent } from './modal-base/modal-base.component';
import { ModalFooterComponent } from './modal-footer/modal-footer.component';
import { ModalHeaderComponent } from './modal-header/modal-header.component';
import { ModalInnerComponent } from './modal-inner/modal-inner.component';
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
    ModalComponent,
    ModalBaseComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalInnerComponent,
    ToastComponent
  ],
  exports: [
    AlertComponent,
    DialogComponent,
    DialogBaseComponent,
    MaskComponent,
    ModalComponent,
    ModalBaseComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalInnerComponent,
    ToastComponent
  ]
})
export class UIModalModule {
}