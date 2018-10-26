export interface UITouchEvent {
  /** 封装后的事件名 */
  eventName: string;
  /** 原生的 dom 事件对象 */
  srcEvent: TouchEvent;
  /**
   * 停止当前事件的监听
   * 注：调用 `stop()` 方法，只会停止监听本次手势的监听，并不会影响下一次手势，如当前手势的触发方向不是预期的方向，可以通过些
   * 方法停止。
   */
  stop: Function;
  /**
   * 清除累计的值
   * 根据手势的不同，清除的数据不同。如：uiPan 从记录每一次拖动的累加值，这些数据往往是有用的信息，但某些时候，可能需要重置这
   * 值，则可以通过调用些方法，来清除。
   */
  resetCumulative: Function;
  /** 事件类型 */
  type: 'touchmove' | 'touchend';
  /** 是否是第一次触发手势 */
  first: boolean;
  /** 当前手势持续的时间 */
  durationTime: number;
}