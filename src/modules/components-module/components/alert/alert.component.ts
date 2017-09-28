import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertConfig, AlertController } from './alert-controller.service';

@Component({
    selector: 'ui-alert',
    templateUrl: './alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
    show: boolean = false;

    title: string = '';
    content: string = '';
    btnText: string = '';

    private sub: Subscription;

    constructor(private alertController: AlertController) {
    }

    ngOnInit() {
        // 订阅alert事件
        this.sub = this.alertController.alertConfig$.subscribe((params: AlertConfig) => {
            // 设置状态，以弹出对话框
            this.show = true;

            this.title = params.title;
            this.content = params.content;
            this.btnText = params.btnText;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
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