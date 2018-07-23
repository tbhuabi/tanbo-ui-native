import { Component, TemplateRef, ViewChild } from '@angular/core';

import { ModalController, DialogController, AlertController } from '../../tanbo/ui-native/public_api';

@Component({
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  @ViewChild('modal', {read: TemplateRef})
  modal: TemplateRef<any>;
  @ViewChild('modal2', {read: TemplateRef})
  modal2: TemplateRef<any>;

  constructor(private modalController: ModalController,
              private alertController: AlertController,
              private dialogController: DialogController) {
  }

  show() {
    this.alertController.show('test');
    // this.modalController.show(Math.random() > 0.5 ? this.modal : this.modal2);
  }

  hide() {
    this.modalController.hide();
  }
}
