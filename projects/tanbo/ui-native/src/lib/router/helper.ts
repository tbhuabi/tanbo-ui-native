import { InjectionToken } from '@angular/core';

/**
 * @whatItDoes 定义路由转声动画的帧数
 *
 * 你可以通过 provide 自定义帧数，帧数越多，转场动画的时间越长
 *
 * @howToUse
 * ```typescript
 * import { NgModule } from '@angular/core';
 * import { UI_ROUTER_ANIMATION_STEPS } from '@tanbo/ui-native';
 *
 * @NgModule({
 *   ...
 *   providers: [{
 *     provide: UI_ROUTER_ANIMATION_STEPS,
 *     useValue: 30
 *   }]
 * })
 * export class AppModule {
 * }
 * ```
 */
export const UI_ROUTER_ANIMATION_STEPS = new InjectionToken<number>('UI_ROUTER_ANIMATION_STEPS');

/**
 * @whatItDoes 定义 ui-back 组件左箭头的 html class 的值
 *
 * 你可以通过 provide 定义自己的 class
 *
 * @howToUse
 * ```typescript
 * import { NgModule } from '@angular/core';
 * import { UI_BACK_ICON_CLASSNAME } from '@tanbo/ui-native';
 *
 * @NgModule({
 *   ...
 *   providers: [{
 *     provide: UI_BACK_ICON_CLASSNAME,
 *     useValue: 'custom-classname'
 *   }]
 * })
 * export class AppModule {
 * }
 * ```
 */
export const UI_BACK_ICON_CLASSNAME = new InjectionToken<string>('UI_BACK_ICON_CLASSNAME');