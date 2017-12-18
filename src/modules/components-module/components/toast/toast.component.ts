import { Component, OnInit } from '@angular/core';
import { trigger, style, state, transition, animate } from '@angular/animations';

import { ToastConfig, ToastController, ToastType } from './toast-controller.service';

@Component({
    selector: 'ui-toast',
    templateUrl: './toast.component.html',
    animations: [
        trigger('toastState', [state('*', style({
            opacity: 1
        })), transition(':leave', animate('.15s', style({
            opacity: 0,
        }))), transition(':enter', [style({
            opacity: 0,
        }), animate('.15s', style({
            opacity: 1,
        }))])])
    ]
})
export class ToastComponent implements OnInit {
    messageList: Array<any> = [];

    constructor(private toastService: ToastController) {
    }

    ngOnInit() {
        this.toastService.notify$.subscribe((config: ToastConfig) => {
            let _config: any = {};
            _config.rawConfig = config;
            switch (config.type) {
                case ToastType.Default:
                    _config.type = 'default';
                    break;
                case ToastType.Primary:
                    _config.type = 'primary';
                    break;
                case ToastType.Info:
                    _config.type = 'info';
                    break;
                case ToastType.Success:
                    _config.type = 'success';
                    break;
                case ToastType.Warning:
                    _config.type = 'warning';
                    break;
                case ToastType.Danger:
                    _config.type = 'danger';
                    break;
                default:
                    _config.type = 'default';
            }
            _config.content = config.content || '';
            _config.time = config.time || 2000;

            this.messageList.push(_config);
            setTimeout(() => {
                for (let i = 0; i < this.messageList.length; i++) {
                    if (this.messageList[i] === _config) {
                        this.messageList.splice(i, 1);
                        return;
                    }
                }
            }, _config.time);
        });
    }
}