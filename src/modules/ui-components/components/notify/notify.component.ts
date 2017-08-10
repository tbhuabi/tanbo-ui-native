import { Component, OnInit } from '@angular/core';
import { trigger, style, state, transition, animate } from '@angular/animations';

import { NotifyConfig, NotifyController, NotifyType } from '../../services/notify-controller.service';

@Component({
    selector: 'ui-notify',
    templateUrl: './notify.component.html',
    animations: [
        trigger('notifyState', [state('*', style({
            transformOrigin: '100% 0'
        })), transition(':leave', animate('.3s', style({
            transform: 'scaleX(0)',
            opacity: 0
        }))), transition(':enter', [style({
            transform: 'translateY(40px)',
            opacity: 0
        }), animate('.3s', style({
            transform: 'translateY(0)',
            opacity: 1
        }))])])
    ]
})
export class NotifyComponent implements OnInit {
    messageList: Array<any> = [];
    private timer: any = null;

    constructor(private notifyService: NotifyController) {
    }

    ngOnInit() {
        this.notifyService.notify$.subscribe((config: NotifyConfig) => {
            let _config: any = {};
            _config.rawConfig = config;
            switch (config.type) {
                case NotifyType.Default:
                    _config.type = 'default';
                    break;
                case NotifyType.Primary:
                    _config.type = 'primary';
                    break;
                case NotifyType.Info:
                    _config.type = 'info';
                    break;
                case NotifyType.Success:
                    _config.type = 'success';
                    break;
                case NotifyType.Warning:
                    _config.type = 'warning';
                    break;
                case NotifyType.Danger:
                    _config.type = 'danger';
                    break;
                default:
                    _config.type = 'default';
            }
            _config.content = config.content || '';
            _config.time = config.time || 5000;
            _config.autoHide = config.autoHide;

            _config.currentTime = 0;
            _config.proportion = 100;

            this.messageList.push(_config);
            this.start();
        });
    }

    close(i: number) {
        this.messageList.splice(i, 1);
        this.start();
    }

    stop(item: any) {
        item.time = item.rawConfig.time || 5000;
        item.currentTime = 0;
        item.proportion = 100;
        item.autoHide = false;
        this.start();
    }

    restart(item: any) {
        if (item.rawConfig.autoHide) {
            item.autoHide = true;
        }
        this.start();
    }

    start() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            let isClear = true;
            for (let i = 0; i < this.messageList.length; i++) {
                let item = this.messageList[i];
                if (item.autoHide) {
                    isClear = false;

                    item.currentTime += 20;
                    let n = item.currentTime / item.time;
                    item.proportion = (n > 1 ? 1 : n) * 100;
                    if (n > 1) {
                        this.messageList.splice(i, 1);
                        i--;
                    }
                }
            }
            if (isClear) {
                clearInterval(this.timer);
            }
        }, 20);
    }
}