import { Component, OnInit, OnDestroy, TemplateRef, Optional } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
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

  constructor(private modalController: ModalController,
              @Optional() private router: Router) {
  }

  ngOnInit() {
    if (this.router) {
      this.subs.push(this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.isShow = false;
        }
      }));
    }
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