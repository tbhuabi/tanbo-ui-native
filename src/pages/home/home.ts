import { Component, TemplateRef, ViewChild, OnInit, ComponentRef } from '@angular/core';

import {
  ModalController,
  DialogController,
  AlertController,
  ContentLoadingController
} from '../../tanbo/ui-native/public_api';
import { SelectComponent } from '../../tanbo/ui-native/lib/forms/select/select.component';

@Component({
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class HomeComponent implements OnInit {
  show(n: any) {
    document.title = n.scale;
  }

  constructor(private contentLoadingController: ContentLoadingController) {
  }

  ngOnInit() {
    this.contentLoadingController.show()
  }
}
