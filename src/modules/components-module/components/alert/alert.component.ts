import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { AlertConfig, AlertController } from './alert-controller.service';

@Component({
    selector: 'ui-alert',
    templateUrl: './alert.component.html',
    animations: [
        trigger('alertContentAnimate', [transition('out => in', animate('0.15s', keyframes([
            style({
                transform: 'scale(1.2)',
                offset: 0
            }),
            style({
                transform: 'scale(1)',
                offset: 1
            })
        ]))), transition('in => out', animate('0.15s', keyframes([
            style({
                transform: 'scale(1)',
                offset: 0
            }),
            style({
                transform: 'scale(0.8)',
                offset: 1
            })
        ])))]),
        trigger('alertBgAnimate', [state('*', style({
            opacity: 0
        })), state('in', style({
            opacity: 1
        })), state('out', style({
            opacity: 0
        })), transition('in <=> out', animate('0.2s'))])
    ]
})
export class AlertComponent implements OnInit, OnDestroy {
    @HostBinding('class.show')
    isShow: boolean = false;

    @HostBinding('@alertBgAnimate')
    get confirmBgState() {
        return this.animateState ? 'in' : 'out';
    }

    animateState: boolean = false;
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
            this.isShow = true;
            this.animateState = true;

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
        this.animateState = false;
    }

    done() {
        // 当弹窗动画完成时，发布事件
        if (!this.animateState) {
            this.isShow = false;
            this.alertController.publishAction();
        }
    }
}