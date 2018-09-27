import { Component, OnDestroy, OnInit, TemplateRef, Optional } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { AlertConfig, AlertController } from './alert-controller';

@Component({
  selector: 'ui-alert',
  templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
  show: boolean = false;

  title: string | TemplateRef<any> = '';
  content: string | TemplateRef<any> = '';
  btnText: string = '';

  get titleIsString() {
    return typeof this.title === 'string';
  }

  get contentIsString() {
    return typeof this.content === 'string';
  }

  private subs: Subscription[] = [];

  constructor(private alertController: AlertController,
              @Optional() private router: Router) {
  }

  ngOnInit() {
    if (this.router) {
      this.subs.push(this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.checked();
        }
      }));
    }
    // 订阅alert事件
    this.subs.push(this.alertController.alertConfig.subscribe((params: AlertConfig) => {
      // 设置状态，以弹出对话框
      this.show = true;

      this.title = params.title;
      this.content = params.content;
      this.btnText = params.btnText;
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }

  checked() {
    // 当点击确认按扭时关闭弹窗
    this.show = false;
  }

  hide() {
    // 当弹窗动画完成时，发布事件
    this.alertController.publishAction();
  }
}