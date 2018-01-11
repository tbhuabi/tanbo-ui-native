import { Component, HostBinding, OnInit, OnDestroy, Inject } from '@angular/core';
import { Subscription } from 'rxjs';

import { BrowserENV, UI_BROWSER_ENV } from '../../config';
import { AppController } from '../app/app-controller';

@Component({
    selector: 'ui-page',
    templateUrl: './page.component.html'
})
export class PageComponent implements OnDestroy, OnInit {

    // 根据不同环境，需要把页面头部增高相对尺寸，以显示时间，电池电量等信息，这里通过样式来控制
    @HostBinding('class.iphone')
    get isIphone() {
        return this.env === BrowserENV.iphone;
    }

    @HostBinding('class.iphone-x')
    get isIphoneX() {
        return this.env === BrowserENV.iphoneX;
    }

    @HostBinding('class.android')
    get isAndroid() {
        return this.env === BrowserENV.android;
    }

    @HostBinding('class.default')
    get isDefault() {
        return this.env === BrowserENV.default;
    }

    private sub: Subscription;

    constructor(@Inject(UI_BROWSER_ENV) private env: BrowserENV,
                private appController: AppController) {
    }

    ngOnInit() {
        this.sub = this.appController.onResize$.subscribe((env: BrowserENV) => {
            this.env = env;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}