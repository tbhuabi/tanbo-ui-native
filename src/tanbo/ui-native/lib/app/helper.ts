import { InjectionToken } from '@angular/core';

// 可能的运行环境
export enum BrowserENV {
  iphone = 'iphone',
  iphoneX = 'iphoneX',
  android = 'android',
  default = 'default'
}

// 程序当前运行环境
export const UI_BROWSER_ENV = new InjectionToken<string>('UI_BROWSER_ENV');
export const UI_SCREEN_SCALE = new InjectionToken<number>('UI_SCREEN_SCALE');