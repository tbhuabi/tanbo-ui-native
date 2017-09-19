import { AfterViewInit, Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { AlertController } from '../alert/alert-controller.service';
import { ConfirmController } from '../confirm/confirm-controller.service';
import { ListActivatedService } from '../list-item/list-activated.service';
import { NavController } from '../navigation/navigation-controller.service';
import { ToastController } from '../toast/toast-controller.service';
import { ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-app',
    templateUrl: './app.component.html',
    providers: [
        AlertController,
        ConfirmController,
        ListActivatedService,
        NavController,
        ToastController,
        ViewStateService
    ]
})
export class AppComponent implements OnInit, AfterViewInit {
    @Input()
    rootPage: any;
    @Input()
    baseFontSize: number = 10;

    private htmlElement: HTMLElement;
    private defaultDocWidth: number = 320;

    constructor(@Inject(DOCUMENT) private document: Document,
                private listActivatedService: ListActivatedService,
                private navController: NavController) {
    }

    ngOnInit() {
        this.htmlElement = this.document.querySelector('html');
        this.resize();
    }

    ngAfterViewInit() {
        if (this.rootPage) {
            // 当页面初始化时，主动添加根页面
            this.navController.push(this.rootPage);
        }
    }

    @HostListener('window:resize')
    resize() {
        // 通过当前视口的宽度，动态设置 css rem 值的大小
        if (!this.htmlElement) {
            return;
        }
        let docWidth = this.htmlElement.getBoundingClientRect().width;
        let scale = docWidth / this.defaultDocWidth;
        this.htmlElement.style.fontSize = `${scale * this.baseFontSize}px`;
    }

    @HostListener('document:touchstart')
    documentTouchStart() {
        // 当页面有 list 组件时，如果其中某一项已打开 sliding，当用户点击其它地方时，需要发布全局事件，来收起 sliding
        this.listActivatedService.publish();
    }
}