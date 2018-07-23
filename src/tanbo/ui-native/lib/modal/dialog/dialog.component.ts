import { Component, OnDestroy, OnInit, TemplateRef } from '@angular/core';
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

  private sub: Subscription;

  constructor(private dialogController: DialogController) {
  }

  ngOnInit() {
    // 订阅用户事件
    this.sub = this.dialogController.config.subscribe((params: DialogConfig) => {
      // 设置动画状态
      this.show = true;

      // 赋值相应参数
      this.title = params.title;
      this.content = params.content;
      if (params.btnsText) {
        this.btnsText = params.btnsText;
      }

    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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