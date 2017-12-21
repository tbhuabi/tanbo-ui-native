import { Component, HostListener, Inject, Input, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { PRIMARY_OUTLET } from '@angular/router';
import { DOCUMENT, Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { ListActivatedService } from '../list-item/list-activated.service';
import { RouteCacheController } from '../router/route-cache-controller';
import { AppController, getENV } from './app-controller';

@Component({
    selector: 'ui-app',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
    @Input()
    baseFontSize: number = 10;
    @Input()
    name: string = PRIMARY_OUTLET;

    @HostBinding('attr.version')
    version = process.env.version;

    private htmlElement: HTMLElement;
    private defaultDocWidth: number = 320;

    private sub: Subscription;

    constructor(@Inject(DOCUMENT) private document: Document,
                private routeCacheController: RouteCacheController,
                private location: Location,
                private appController: AppController,
                private listActivatedService: ListActivatedService) {
    }

    ngOnInit() {
        this.sub = this.location.subscribe(() => {
            this.routeCacheController.isCacheCurrentView(false);
        }) as Subscription;

        this.htmlElement = this.document.querySelector('html');
        this.resize();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
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
        this.appController.resize(getENV());
    }

    @HostListener('document:touchstart')
    documentTouchStart() {
        // 当页面有 list 组件时，如果其中某一项已打开 sliding，当用户点击其它地方时，需要发布全局事件，来收起 sliding
        this.listActivatedService.publish();
    }
}