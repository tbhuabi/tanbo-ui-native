import { Component, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ConfirmController, ConfirmConfig } from '../../services/confirm-controller.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'ui-confirm',
    templateUrl: './confirm.component.html',
    animations: [trigger('confirmContentAnimate', [state('*', style({
        opacity: 0,
        transform: 'translateY(-50%)'
    })), state('in', style({
        opacity: 1,
        transform: 'translateY(20%)'
    })), state('out', style({
        opacity: 0,
        transform: 'translateY(-50%)'
    })), transition('in <=> out', animate('0.2s'))]), trigger('confirmBgAnimate', [state('*', style({
        opacity: 0
    })), state('in', style({
        opacity: 1
    })), state('out', style({
        opacity: 0
    })), transition('in <=> out', animate('0.2s'))])]
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
            this.confirmService.confirmActionSource.next(this.result);
        }
    }
}