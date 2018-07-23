import { InjectionToken } from '@angular/core';

// select 右边箭头的 className 注入 key
export const UI_SELECT_ARROW_CLASSNAME = new InjectionToken<string>('UI_SELECT_ARROW_CLASSNAME');

export function inputAttrToBoolean(value: any) {
  return value === '' || !!value;
}
