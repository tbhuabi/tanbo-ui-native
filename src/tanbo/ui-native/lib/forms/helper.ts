import { InjectionToken } from '@angular/core';

/**
 * @whatItDoes 给 `ui-select`、`ui-input[type=date]` 组件的下拉箭头的 html 元素 class 的名字的 token
 *
 * 你可以通过 provide 定义自己的下拉箭头 class
 *
 * @howToUse
 * ```typescript
 * import { NgModule } from '@angular/core';
 * import { UI_SELECT_ARROW_CLASSNAME } from '@tanbo/ui-native';
 *
 * @NgModule({
 *   ...
 *   providers: [{
 *     provide: UI_SELECT_ARROW_CLASSNAME,
 *     useValue: 'custom-classname'
 *   }]
 * })
 * export class AppModule {
 * }
 * ```
 */
export const UI_SELECT_ARROW_CLASSNAME = new InjectionToken<string>('UI_SELECT_ARROW_CLASSNAME');

/**
 * 把表单元素的输入属性转成 boolean 类型
 * '' => true
 * 0 => false
 * null => false
 * undefined => false
 *
 * @param value
 * @returns boolean
 */
export function inputAttrToBoolean(value: any) {
  return value === '' || !!value;
}
