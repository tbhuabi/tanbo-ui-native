export interface UITouchEvent {
  eventName: string;
  srcEvent: TouchEvent;
  stop: Function;
  resetCumulative: Function;
  type: 'touchmove' | 'touchend';
  first: boolean;
  durationTime: number;
}