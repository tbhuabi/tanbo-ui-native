import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';

import { ConfirmConfig, ConfirmController } from './confirm-controller.service';

@Component({
    selector: 'ui-confirm',
    templateUrl: './confirm.component.html',
    animations: [
        trigger('confirmContentAnimate', [transition('out => in', animate('0.15s', keyframes([
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
        trigger('confirmBgAnimate', [state('*', style({
            opacity: 0
        })), state('in', style({
            opacity: 1
        })), state('out', style({
            opacity: 0
        })), transition('in <=> out', animate('0.2s'))])
    ]
})

export class ConfirmComponent implements OnInit, OnDestroy {
    @HostBinding('class.show')
    isShow: boolean = false;

    @HostBinding('@confirmBgAnimate')
    get confirmBgState() {
        return this.animateState ? 'in' : 'out';
    }

    animateState: boolean = false;
    title: string = '';
    content: string = '';
    btnsText: Array<any> = ['取消', '确认'];
    result: boolean = false;

    private sub: Subscription;

    constructor(private confirmService: ConfirmController) {
    }

    ngOnInit() {
        // 订阅用户事件
        this.sub = this.confirmService.confirmConfig$.subscribe((params: ConfirmConfig) => {
            // 设置动画状态
            this.isShow = true;
            this.animateState = true;

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
        this.animateState = false;
        this.result = result;
    }

    done() {
        // 当弹窗关闭动画完成时，发布相应事件
        if (!this.animateState) {
            this.isShow = false;
            this.confirmService.publishAction(this.result);
        }
    }
}