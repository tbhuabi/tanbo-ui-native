import { Component, HostListener, Inject, Input, OnInit, OnDestroy, HostBinding } from '@angular/core';
import { PRIMARY_OUTLET } from '@angular/router';
import { DOCUMENT, Location } from '@angular/common';
import { Subscription } from 'rxjs';

import { BrowserENV, UI_BROWSER_ENV, UI_SCREEN_SCALE } from '../../helper';
import { ListActivatedService } from '../../list/index';
import { RouteCacheController } from '../../router/index';
import { AppController, getDeviceType } from './app-controller';

@Component({
  selector: 'ui-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * 根据不同的屏幕宽度，设置 html 元素的 font-size
   * 主要用于 rem 布局，默认为 10
   */
  @Input() baseFontSize: number = 10;
  /**
   * 屏幕 X 轴默认逻辑像素
   */
  @Input() screenWidth = 375;
  /**
   * angular 路由的 name
   */
  @Input() name: string = PRIMARY_OUTLET;

  // 根据不同环境，需要把页面头部增高相对尺寸，以显示时间，电池电量等信息，这里通过样式来控制
  @HostBinding('class.ui-iphone')
  get isIphone() {
    return this.env === BrowserENV.iphone;
  }

  @HostBinding('class.ui-iphone-x')
  get isIphoneX() {
    return this.env === BrowserENV.iphoneX;
  }

  @HostBinding('class.ui-android')
  get isAndroid() {
    return this.env === BrowserENV.android;
  }

  @HostBinding('class.ui-default')
  get isDefault() {
    return this.env === BrowserENV.default;
  }

  showMask: boolean = false;

  private htmlElement: HTMLElement;
  private get defaultDocWidth() {
    return this.screenWidth * this.scale;
  }

  private subs: Array<Subscription> = [];

  constructor(@Inject(DOCUMENT) private document: any,
              @Inject(UI_BROWSER_ENV) private env: BrowserENV,
              @Inject(UI_SCREEN_SCALE) private scale: number,
              private routeCacheController: RouteCacheController,
              private location: Location,
              private appController: AppController,
              private listActivatedService: ListActivatedService) {
  }

  ngOnInit() {
    // 根据当前应用是否在在路由动画转场中时，切换遮罩的显示与隐藏，防止多次点击
    this.subs.push(this.appController.transition.subscribe(b => {
      this.showMask = b;
    }));
    // 当屏幕大小改变时，变更环境变量
    this.subs.push(this.appController.onResize.subscribe((env: BrowserENV) => {
      this.env = env;
    }));
    // 当路由地址变更时，设置路由缓存
    this.subs.push(this.location.subscribe(() => {
      this.routeCacheController.isCacheCurrentView(false);
    }) as Subscription);

    this.htmlElement = this.document.querySelector('html');
    this.resize();
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }

  @HostListener('window:resize')
  resize() {
    // 通过当前视口的宽度，动态设置 css rem 值的大小
    if (!this.htmlElement) {
      return;
    }
    const docWidth = this.htmlElement.getBoundingClientRect().width;
    const scale = docWidth / this.defaultDocWidth;
    this.htmlElement.style.fontSize = `${scale * this.baseFontSize}px`;
    this.appController.resize(getDeviceType());
  }

  @HostListener('document:touchstart')
  documentTouchStart() {
    // 当页面有 list 组件时，如果其中某一项已打开 sliding，当用户点击其它地方时，需要发布全局事件，来收起 sliding
    this.listActivatedService.publish();
  }
}