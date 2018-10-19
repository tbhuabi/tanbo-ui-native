export type PanEventDirection = 'up' | 'down' | 'left' | 'right' | 'origin';

export interface PanEvent {
  firstDirection: PanEventDirection;
  startX: number;
  startY: number;
  moveX: number;
  moveY: number;
  distanceX: number;
  distanceY: number;
  cumulativeX: number;
  cumulativeY: number;
  type: 'touching' | 'touchend';
  srcEvent: TouchEvent;
  stop: Function;
  resetCumulative: Function;
}