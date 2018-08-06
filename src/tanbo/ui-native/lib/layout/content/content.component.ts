import { Component, ElementRef, HostBinding, HostListener, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { CubicBezier } from 'tanbo-bezier';
import { Easing } from '@tweenjs/tween.js';

import {
  UI_ROUTER_ANIMATION_STEPS,
  RouterService,
  ViewState,
  ViewStateService,
  UI_VIEW_INIT_STATE
} from '../../router/index';
import { UI_SCREEN_SCALE } from '../../app/index';

@Component({
  selector: 'ui-content',
  templateUrl: './content.component.html'
})
export class ContentComponent implements OnDestroy, OnInit {
  @HostBinding('style.transform')
  @HostBinding('style.webkitTransform')
  translate: string;
  @HostBinding('style.opacity')
  opacity: number;
  private subs: Array<Subscription> = [];
  private distanceX: number = 0;
  private animationId: number;
  private maxWidth: number;

  constructor(private viewStateService: ViewStateService,
              private elementRef: ElementRef,
              private routerService: RouterService,
              @Inject(UI_VIEW_INIT_STATE) private state: ViewState,
              @Inject(UI_SCREEN_SCALE) private scale: number,
              private renderer: Renderer2,
              @Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number) {
  }

  ngOnInit() {
    const steps = this.steps;
    const bezier = new CubicBezier(.36, .66, .04, 1);
    this.subs.push(this.viewStateService.state.subscribe(state => {
      this.state = state;
    }));
    this.subs.push(this.viewStateService.touchProgress.subscribe(p => {
      if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
        this.translate = `translate3d(${p / steps * 100}%, 0, 0)`;
      } else if (this.state === ViewState.ToStack) {
        this.translate = `translate3d(${-33 + 33 * p / steps}%, 0, 0)`;
        this.opacity = 0.9 + 0.1 * p / steps;
      }
    }));
    this.subs.push(this.viewStateService.progress.subscribe((p: number) => {
      const progress = bezier.update(p / steps);

      switch (this.state) {
        case ViewState.Activate:
          this.opacity = 1;
          this.translate = `translate3d(${100 - progress * 100}%, 0, 0)`;
          break;
        case ViewState.Destroy:
          this.opacity = 1;
          this.translate = `translate3d(${progress * 100}%, 0, 0)`;
          break;
        case ViewState.ToStack:
          this.translate = `translate3d(${progress * -33}%, 0, 0)`;
          this.opacity = 1 - 0.1 * p / steps;
          break;
        case ViewState.Reactivate:
          const n = -33 + progress * 33;
          // 当dom元素的style有transform属性时，会导致子级元素 position: fixed 全屏失效
          // 会跟着有定位的父级同样大小
          this.translate = n === 0 ? '' : `translate3d(${n}%, 0, 0)`;
          this.opacity = 0.9 + 0.1 * progress;
          break;
      }
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }

  @HostListener('touchstart', ['$event'])
  touchStart(event: any) {
    const startPoint = event.touches[0];
    const startX = startPoint.pageX;
    const startY = startPoint.pageY;

    if (startX > 50 * this.scale && this.state !== ViewState.Sleep) {
      return;
    }
    cancelAnimationFrame(this.animationId);

    let unbindTouchMoveFn: () => void;
    let unbindTouchEndFn: () => void;
    let unbindTouchCancelFn: () => void;
    let unbindFn: () => void;

    const element = this.elementRef.nativeElement;
    const maxWidth = element.offsetWidth;
    const startTime = Date.now();

    this.maxWidth = maxWidth;

    let isBack = false;
    let progress = 0;

    unbindTouchMoveFn = this.renderer.listen(element, 'touchmove', (moveEvent: any) => {
      const movePoint = moveEvent.touches[0];
      const moveX = movePoint.pageX;
      const moveY = movePoint.pageY;

      const distanceY = moveY - startY;
      let distanceX = moveX - startX;
      if (distanceX < distanceY && !isBack) {
        unbindFn();
        return;
      }

      isBack = true;

      if (distanceX < 0) {
        distanceX = 0;
      } else if (distanceX > maxWidth) {
        distanceX = maxWidth;
      }
      this.distanceX = Math.floor(distanceX);
      progress = distanceX / maxWidth * this.steps;
      this.routerService.publishMoveBackProgress(progress);
    });

    unbindFn = () => {

      unbindTouchMoveFn();
      unbindTouchEndFn();
      unbindTouchCancelFn();
      if (progress === 0) {
        return;
      }

      const endTime = Date.now();
      if (endTime - startTime < 100 && this.distanceX > 50 * this.scale) {
        this.animationTo(maxWidth);
        return;
      }
      if (this.distanceX < maxWidth / 3) {
        this.animationTo(0);
      } else {
        this.animationTo(maxWidth);
      }
    };

    unbindTouchEndFn = this.renderer.listen(element, 'touchend', unbindFn);
    unbindTouchCancelFn = this.renderer.listen(element, 'touchcancel', unbindFn);
  }

  animationTo(target: number) {
    const l = target - this.distanceX;
    const oldDistanceX = this.distanceX;
    let i = 0;
    const fn = () => {
      i++;
      this.distanceX = oldDistanceX + l * Easing.Cubic.Out(i / 10);
      this.routerService.publishMoveBackProgress(this.distanceX / this.maxWidth * this.steps);
      if (i < 10) {
        this.animationId = requestAnimationFrame(fn);
      }
    };

    this.animationId = requestAnimationFrame(fn);
  }
}