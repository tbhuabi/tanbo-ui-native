import { InjectionToken } from '@angular/core';

/**
 * 当前运行环境的枚举量
 */
export enum BrowserENV {
  iphone = 'iphone',
  iphoneX = 'iphoneX',
  android = 'android',
  default = 'default'
}

/**
 * @whatItDoes 给组件、指令或服务注入当前运行环境的 token
 * 一般由框架自动检测，你可以在组件注入，并根据不同的环境，编写后续逻辑
 *
 * @howToUse
 * ```typescript
 * import { Inject } from '@angular/core';
 * import { UI_BROWSER_ENV, BrowserENV } from '@tanbo/ui-native';
 *
 * @Component({
 *   templateUrl: './demo.html'
 * })
 * export class DemoComponent {
 *   constructor(@Inject(UI_BROWSER_ENV) private env: BrowserENV) {
 *     console.log(env); // 当前环境
 *   }
 * }
 *
 * ```
 */
export const UI_BROWSER_ENV = new InjectionToken<BrowserENV>('UI_BROWSER_ENV');

/**
 * @whatItDoes 给组件、指令或服务注入当前缩放系数的 token
 * @howToUse
 * ```typescript
 * import { Inject } from '@angular/core';
 * import { UI_SCREEN_SCALE } from '@tanbo/ui-native';
 *
 * @Component({
 *   templateUrl: './demo.html'
 * })
 * export class DemoComponent {
 *   constructor(@Inject(UI_SCREEN_SCALE) private env: number) {
 *     console.log(env); // 当前环境
 *   }
 * }
 *
 * ```
 */
export const UI_SCREEN_SCALE = new InjectionToken<number>('UI_SCREEN_SCALE');