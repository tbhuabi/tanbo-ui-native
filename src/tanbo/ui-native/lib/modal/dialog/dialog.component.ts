import { Component, OnDestroy, OnInit, TemplateRef, Optional } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

import { DialogConfig, DialogController } from './dialog-controller';

@Component({
  selector: 'ui-dialog',
  templateUrl: './dialog.component.html'
})

export class DialogComponent implements OnInit, OnDestroy {
  show: boolean = false;

  title: string | TemplateRef<any> = '';
  content: string | TemplateRef<any> = '';
  btnsText: Array<any> = ['取消', '确认'];
  result: boolean = false;

  get titleIsString() {
    return typeof this.title === 'string';
  }

  get contentIsString() {
    return typeof this.content === 'string';
  }

  private subs: Subscription[] = [];

  constructor(private dialogController: DialogController,
              @Optional() private router: Router) {
  }

  ngOnInit() {
    if (this.router) {
      this.subs.push(this.router.events.subscribe(event => {
        if (event instanceof NavigationStart) {
          this.show = false;
        }
      }));
    }
    // 订阅用户事件
    this.subs.push(this.dialogController.config.subscribe((params: DialogConfig) => {
      // 设置动画状态
      this.show = true;

      // 赋值相应参数
      this.title = params.title;
      this.content = params.content;
      if (params.btnsText) {
        this.btnsText = params.btnsText;
      }
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }

  checked(result: boolean) {
    // 当用户点击按扭时，关闭弹窗
    this.show = false;
    this.result = result;
  }

  hide() {
    // 当弹窗关闭动画完成时，发布相应事件
    this.dialogController.publishAction(this.result);
  }
}