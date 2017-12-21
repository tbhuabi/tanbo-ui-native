import { InjectionToken } from '@angular/core';

// 路由动画帧数
export const UI_ROUTER_ANIMATION_STEPS = new InjectionToken<number>('UI_ROUTER_ANIMATION_STEPS');

// ui-back 组件左箭头 icon 的 className
export const UI_BACK_ICON_CLASSNAME = new InjectionToken<string>('UI_BACK_ICON_CLASSNAME');

// 可能的运行环境
export enum BrowserENV {
    iphone = 'iphone',
    iphoneX = 'iphoneX',
    android = 'android',
    default = 'default'
}

// 程序当前运行环境
export const UI_BROWSER_ENV = new InjectionToken<string>('UI_BROWSER_ENV');