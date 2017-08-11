import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Subscription } from 'rxjs';

import { ConfirmController, ConfirmConfig } from './confirm-controller.service';

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
        this.sub = this.confirmService.confirmConfig$.subscribe((params: ConfirmConfig) => {
            this.isShow = true;
            this.animateState = true;

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

    publishAction(result: boolean) {
        this.animateState = false;
        this.result = result;
    }

    done() {
        if (!this.animateState) {
            this.isShow = false;
            this.confirmService.publishAction(this.result);
        }
    }
}