import { Component, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { Subscription } from 'rxjs';

import { ModalController } from './modal-controller';

@Component({
  selector: 'ui-modal-base',
  templateUrl: './modal-base.component.html'
})
export class ModalBaseComponent implements OnDestroy, OnInit {
  template: TemplateRef<any>;

  isShow = false;
  private subs: Subscription[] = [];

  constructor(private modalController: ModalController) {
  }

  ngOnInit() {
    this.subs.push(this.modalController.template.subscribe(template => {
      this.isShow = true;
      this.template = template;
    }));
    this.subs.push(this.modalController.onHide.subscribe(() => {
      this.isShow = false;
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }

  animationEnd() {
    this.template = null;
  }
}