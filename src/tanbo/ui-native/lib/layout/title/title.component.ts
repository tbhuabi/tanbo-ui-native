import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener, Inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Subscription } from 'rxjs';
import { CubicBezier } from 'tanbo-bezier';

import { UI_ROUTER_ANIMATION_STEPS, ViewState, ViewStateService, UI_VIEW_INIT_STATE } from '../../router/index';

@Component({
  selector: 'ui-title',
  templateUrl: './title.component.html'
})
export class TitleComponent implements OnDestroy, OnInit, AfterViewInit {
  @HostBinding('style.transform')
  @HostBinding('style.webkitTransform')
  translate: string;
  @HostBinding('style.opacity')
  opacity: number;

  @ViewChild('content')
  contentElement: ElementRef;

  private subs: Array<Subscription> = [];
  private docWidth: number;
  private contentWidth: number = 0;
  private translateDistance: number;

  constructor(@Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number,
              @Inject(UI_VIEW_INIT_STATE) private state: ViewState,
              private elementRef: ElementRef,
              private viewStateService: ViewStateService) {
  }

  @HostListener('window:resize')
  resize() {
    this.docWidth = this.elementRef.nativeElement.offsetWidth;
    this.translateDistance = this.docWidth / 2 - this.contentWidth / 2;
  }

  ngOnInit() {
    const steps = this.steps;
    const bezier = new CubicBezier(.36, .66, .04, 1);
    this.subs.push(this.viewStateService.state.subscribe(state => {
      this.state = state;
    }));
    this.subs.push(this.viewStateService.touchProgress.subscribe(p => {
      let translate: number;
      if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
        this.translate = `translate3d(${p / steps * 100 * 0.7}%, 0, 0)`;
      } else if (this.state === ViewState.ToStack) {
        translate = -this.translateDistance + this.translateDistance * p / steps;
        this.translate = `translate3d(${translate}px, 0, 0)`;
        this.opacity = 0.9 + 0.1 * p / steps;
      }
    }));
    this.subs.push(this.viewStateService.progress.subscribe((p: number) => {
      const progress = bezier.update(p / steps);
      let n: number;
      let translate: number;
      switch (this.state) {
        case ViewState.Activate:
          this.opacity = 1;
          this.translate = `translate3d(${70 - progress * 70}%, 0, 0)`;
          break;
        case ViewState.Destroy:
          this.opacity = 1;
          this.translate = `translate3d(${progress * 70}%, 0, 0)`;
          break;
        case ViewState.ToStack:
          this.translate = `translate3d(${-progress * this.translateDistance}px, 0, 0)`;
          n = 1 - progress * 1.3;
          this.opacity = n < 0 ? 0 : n;
          break;
        case ViewState.Reactivate:
          translate = -this.translateDistance + this.translateDistance * progress;
          this.translate = `translate3d(${translate}px, 0, 0)`;
          n = progress * 2;
          this.opacity = n > 1 ? 1 : n;
          break;
      }
    }));
  }

  ngAfterViewInit() {
    this.docWidth = this.elementRef.nativeElement.offsetWidth;
    this.contentWidth = this.contentElement.nativeElement.offsetWidth;
    this.translateDistance = this.docWidth / 2 - this.contentWidth / 2;
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }
}