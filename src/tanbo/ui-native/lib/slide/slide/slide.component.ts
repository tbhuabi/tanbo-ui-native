import {
  Component,
  ContentChildren,
  QueryList,
  AfterViewInit,
  OnInit,
  Output,
  Input,
  Inject,
  OnDestroy,
  ElementRef,
  HostListener,
  Renderer2, EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Easing } from '@tweenjs/tween.js';

import { UI_SCREEN_SCALE } from '../../helper';
import { AppController } from '../../app/index';
import { SlideItemComponent } from '../slide-item/slide-item.component';

@Component({
  selector: 'ui-slide',
  templateUrl: './slide.component.html'
})
export class SlideComponent implements AfterViewInit, OnDestroy, OnInit {
  @ContentChildren(SlideItemComponent) items: QueryList<SlideItemComponent>;
  @Output() uiPlayed = new EventEmitter<number>();
  @Input() initIndex = 0;
  @Input() speed = 2000;
  @Input() steps = 35;

  @Input()
  set autoPlay(v: boolean) {
    this._autoPay = v;
    if (v) {
      this.play();
    }
  }

  get autoPlay() {
    return this._autoPay;
  }

  get index(): number {
    return Math.ceil(this.progress - 0.5) % this.items.length;
  }

  private progress: number = 0;
  private timer: any = null;
  private animateId: number;
  private containerWidth: number;
  private subs: Subscription[] = [];
  private _autoPay = true;

  constructor(private elementRef: ElementRef,
              @Inject(UI_SCREEN_SCALE) private scale: number,
              private renderer: Renderer2,
              private appController: AppController) {
  }

  ngOnInit() {
    this.progress = this.initIndex;
  }

  ngAfterViewInit() {
    this.containerWidth = this.elementRef.nativeElement.offsetWidth;
    this.subs.push(this.appController.onResize.subscribe(() => {
      this.containerWidth = this.elementRef.nativeElement.offsetWidth;
    }));
    setTimeout(() => {
      this.updateChildrenStyle(this.progress);
      this.play();
    });
    this.subs.push(this.items.changes.pipe(delay(0)).subscribe(() => {
      this.updateChildrenStyle(0);
      this.play();
    }));
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    this.subs.forEach(item => item.unsubscribe());
  }

  @HostListener('touchstart', ['$event'])
  touchStart(event: any) {
    clearTimeout(this.timer);
    cancelAnimationFrame(this.animateId);
    if (this.items.length < 2) {
      return;
    }
    const element = this.elementRef.nativeElement;
    this.containerWidth = element.offsetWidth;
    const startX = event.touches[0].pageX;
    const startY = event.touches[0].pageY;
    const len = this.items.length;

    let moveX: number;
    let moveY: number;

    const startTime: number = Date.now();
    let entTime: number;

    let unTouchMoveFn: () => void;
    let unTouchEndFn: () => void;
    let unTouchCancelFn: () => void;

    const oldProgress = this.progress;

    const autoUpdateStyle = () => {
      let min = 0;
      const max = 20;
      const p = this.progress;

      const offset = startX - moveX;
      let target: number;

      if (entTime - startTime < 200 && Math.abs(offset) > 80 * this.scale) {
        if (offset > 0) {
          target = Math.floor(p) + 1;
        } else {
          target = Math.floor(p);
        }
      } else {
        target = p % 1 > 0.5 ? Math.ceil(p) : Math.floor(p);
      }
      const distance = target - p;

      const updateStyle = () => {
        min++;
        this.progress = (p + Easing.Cubic.Out(min / max) * distance) % len;
        this.updateChildrenStyle(this.progress);
        if (min < max) {
          this.animateId = requestAnimationFrame(updateStyle);
        } else {
          this.uiPlayed.emit(this.progress);
          this.play();
        }
      };
      this.animateId = requestAnimationFrame(updateStyle);
    };

    const unbindFn = (unBindEvent: any) => {
      entTime = Date.now();
      unTouchMoveFn();
      unTouchEndFn();
      unTouchCancelFn();
      unBindEvent.stopPropagation();
      autoUpdateStyle();
    };

    let isFirstMoving = true;

    unTouchMoveFn = this.renderer.listen(element, 'touchmove', (moveEvent: any) => {
      moveX = moveEvent.touches[0].pageX;
      moveY = moveEvent.touches[0].pageY;
      const distanceX = moveX - startX;
      const distanceY = moveY - startY;
      if (Math.abs(distanceY) > Math.abs(distanceX) && isFirstMoving) {
        unTouchMoveFn();
        return;
      }
      isFirstMoving = false;
      this.progress = oldProgress - (distanceX) / this.containerWidth;
      if (this.progress < 0) {
        this.progress += len;
      }
      this.updateChildrenStyle(this.progress);
      moveEvent.stopPropagation();
    });

    unTouchEndFn = this.renderer.listen(element, 'touchend', unbindFn);
    unTouchCancelFn = this.renderer.listen(element, 'touchcancel', unbindFn);

    event.stopPropagation();
  }

  play() {
    clearTimeout(this.timer);
    if (!this.autoPlay) {
      return;
    }
    if (this.items.length < 2) {
      return;
    }
    this.timer = setTimeout(() => {
      this.animate();
    }, this.speed);
  }

  private animate() {
    const progress = this.progress;
    let i = 0;
    const animateFn = () => {
      i++;
      this.progress = (progress + Easing.Cubic.Out(i / this.steps)) % this.items.length;
      this.updateChildrenStyle(this.progress);
      if (i < this.steps) {
        this.animateId = requestAnimationFrame(animateFn);
      } else {
        this.uiPlayed.emit(this.progress);
        this.play();
      }
    };
    this.animateId = requestAnimationFrame(animateFn);

  }

  private updateChildrenStyle(progress: number) {
    const currentIndex = Math.floor(progress);
    const p = progress % 1;
    const len = this.items.length;
    this.items.forEach((item: SlideItemComponent, index: number) => {
      if (index === currentIndex) {
        item.state = 'in';
        item.animateProgress = -p;
      } else if (index === (currentIndex + 1) % len) {
        item.state = 'out';
        item.animateProgress = -p + 1;
      } else {
        item.animateProgress = -1;
        item.state = '';
      }
    });
  }
}