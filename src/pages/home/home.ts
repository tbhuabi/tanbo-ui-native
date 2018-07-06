import { Component, TemplateRef, ViewChild } from '@angular/core';

import { ModalController, NotifyController, NotifyType, DialogController } from '../../tanbo/ui/public_api';

@Component({
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent {
  @ViewChild('modal')
  modal: TemplateRef<any>;
  name = 'testname';

  constructor(private modalController: ModalController,
              private dialogController: DialogController,
              private notifyController: NotifyController) {
  }

  show() {
    this.modalController.show(this.modal);
    this.dialogController.show({
      title: 'title',
      content: 'content'
    });

    // this.notifyController.push({
    //   content: 'testeste',
    //   autoHide: false
    // })
  }

  hide() {
    this.modalController.hide();
  }
}
