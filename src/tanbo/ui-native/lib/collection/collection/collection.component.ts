import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  Input,
  Inject,
  OnDestroy,
  HostBinding,
  Output,
  QueryList
} from '@angular/core';
import { CollectionItemComponent } from '../collection-item/collection-item.component';
import { Observable, Subject, Subscription } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Easing } from '@tweenjs/tween.js';
import { UI_SCREEN_SCALE } from '../../helper';
import { PanEvent } from '../../touch/index';

@Component({
  selector: 'ui-collection',
  templateUrl: './collection.component.html'
})
export class CollectionComponent implements AfterContentInit, OnDestroy {
  @ContentChildren(CollectionItemComponent) items: QueryList<CollectionItemComponent>;
  /**
   * 拖动事件 $event 为当前拖动的进度
   */
  @Output() uiSliding = new EventEmitter<number>();
  /**
   * 当完成整屏切换时，触发事件， $event 为当前拖动的进度
   */
  @Output() uiSlidingFinish = new EventEmitter<number>();
  /**
   * 是否为垂直翻页，默认为 false，即为水平翻页
   */
  @Input() vertical: boolean = false;
  /**
   * 是否填满整个容器，默认不填充，如设置为 true，那么会填充满第一个有定位的父级元素
   */
  @Input()
  @HostBinding('class.ui-fill') fill: boolean = true;

  /**
   * 显示第几屏的索引
   */
  @Input()
  set index(value: number) {
    this._index = value;
    if (this.items) {
      cancelAnimationFrame(this.animationId);
      this.setStyle();
    }
  }

  get index() {
    return this._index;
  }

  // 通过子级的多少，计算自身的盒子大小
  get width() {
    return this.vertical ? 'auto' : this.childrenCount * 100 + '%';
  }

  get height() {
    return this.vertical ? this.childrenCount * 100 + '%' : 'auto';
  }

  transform: string = '';

  private get childrenCount() {
    if (this.items) {
      return this.items.length;
    }
    return 0;
  }

  private get stepDistance() {
    return this.vertical ? this.element.offsetHeight : this.element.offsetWidth;
  }

  private max: number = 0;

  private get min(): number {
    return -this.stepDistance * (this.childrenCount - 1);
  }

  // 记录已拖动的距离
  private distance: number = 0;
  private slidingEvent$: Observable<number>;
  private slidingEventSource = new Subject<number>();

  private subs: Array<Subscription> = [];
  private element: HTMLElement;
  private animationId: number;
  private _index: number = 0;

  private oldDistance = 0;

  constructor(@Inject(UI_SCREEN_SCALE) private scale: number,
              private elementRef: ElementRef) {
    this.slidingEvent$ = this.slidingEventSource.asObservable();
  }

  ngAfterContentInit() {
    this.element = this.elementRef.nativeElement;
    this.subs.push(this.slidingEvent$.pipe(distinctUntilChanged()).subscribe((n: number) => {
      this.uiSliding.emit(n);
    }));
    this.setStyle();
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }

  drag(event: PanEvent) {
    if (event.first) {
      this.oldDistance = this.distance;
    }
    if ((this.vertical && event.firstDirection !== 'up' && event.firstDirection !== 'down') ||
      (!this.vertical && event.firstDirection !== 'left' && event.firstDirection !== 'right')) {
      event.stop();
      return;
    }

    if (event.type === 'touchmove') {
      let distance = this.oldDistance + (this.vertical ? event.distanceY : event.distanceX);
      if (distance > this.max) {
        distance /= 3;
      } else if (distance < this.min) {
        distance = this.min + (distance - this.min) / 3;
      }
      this.distance = distance;

      this.transform = `translate${this.vertical ? 'Y' : 'X'}(${distance}px)`;
      // 发送事件，并传出当前已滑动到第几屏的进度
      this.slidingEventSource.next(distance / this.stepDistance * -1);
    } else if (event.type === 'touchend') {
      if (this.distance > this.max) {
        this.autoUpdateStyle(this.max);
        return;
      } else if (this.distance < this.min) {
        this.autoUpdateStyle(this.min);
        return;
      }
      let translateDistance: number;
      const targetIndex = Math.ceil(this.distance / this.stepDistance);
      const offset = Math.abs(this.distance % this.stepDistance);
      if (event.durationTime < 200 && Math.abs(this.vertical ? event.distanceY : event.distanceX) > 50 * this.scale) {
        // swipe
        if (this.oldDistance < this.distance) {
          translateDistance = targetIndex * this.stepDistance;
        } else {
          translateDistance = targetIndex * this.stepDistance - this.stepDistance;
        }
      } else {
        if (offset < (this.stepDistance / 2)) {
          translateDistance = targetIndex * this.stepDistance;
        } else {
          translateDistance = targetIndex * this.stepDistance - this.stepDistance;
        }
      }
      this.autoUpdateStyle(translateDistance);
    }
  }

  setStyle() {
    this.distance = this.index * -1 * this.stepDistance;
    this.transform = `translate${this.vertical ? 'Y' : 'X'}(${this.distance}px)`;
  }

  private autoUpdateStyle(translateDistance: number) {
    const max = 20;
    let step = 0;

    const distance = translateDistance - this.distance;

    if (distance === 0) {
      return;
    }

    const rawDistance = this.distance;

    const moveToTarget = () => {
      step++;
      const translate = rawDistance + Easing.Cubic.Out(step / max) * distance;
      this.distance = translate;
      this.transform = `translate${this.vertical ? 'Y' : 'X'}(${translate}px)`;

      this.slidingEventSource.next(translate / this.stepDistance * -1);
      if (step < max) {
        this.animationId = requestAnimationFrame(moveToTarget);
      } else {
        // 发送事件，并传出当前滑动到了第几屏
        this.uiSlidingFinish.emit(this.distance / this.stepDistance * -1);
      }
    };

    this.animationId = requestAnimationFrame(moveToTarget);
  }
}