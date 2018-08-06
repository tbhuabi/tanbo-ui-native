import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { DOCUMENT, Location } from '@angular/common';
import { Router, Event, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { CubicBezier } from 'tanbo-bezier';

import {
  UI_ROUTER_ANIMATION_STEPS,
  UI_BACK_ICON_CLASSNAME,
  ViewState,
  ViewStateService,
  UI_VIEW_INIT_STATE
} from '../index';
import { AppController, UI_SCREEN_SCALE } from '../../app/index';

@Component({
  selector: 'ui-back',
  templateUrl: './back.component.html'
})
export class BackComponent implements OnInit, OnDestroy, AfterViewInit {
  opacity: number = 1;
  translate: string;
  @ViewChild('text')
  textElement: ElementRef;

  @Input()
  icon: string = '';

  @Input()
  closeBackHandle: boolean = false;

  private subs: Array<Subscription> = [];
  private docWidth: number;
  private contentWidth: number;
  private leftDistance: number;
  private translateDistance: number;

  private timer: any = null;

  constructor(@Inject(DOCUMENT) private document: any,
              @Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number,
              @Inject(UI_SCREEN_SCALE) private scale: number,
              @Inject(UI_BACK_ICON_CLASSNAME) iconName: string,
              @Inject(UI_VIEW_INIT_STATE) private state: ViewState,
              private location: Location,
              private router: Router,
              private appController: AppController,
              private viewStateService: ViewStateService) {
    this.icon = iconName || '';
  }

  @HostListener('window:resize')
  resize() {
    this.docWidth = this.document.body.offsetWidth;
    this.translateDistance = this.docWidth / 2 - (this.leftDistance + 10 * this.scale) - this.contentWidth / 2;
  }

  @HostListener('click')
  click() {
    // 当用户点击组件时，触发视图返回上一页
    clearTimeout(this.timer);
    if (!this.closeBackHandle) {
      this.timer = setTimeout(() => {
        this.appController.quit();
      }, 300);
      this.location.back();
    }
  }

  ngOnInit() {
    this.subs.push(this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        clearTimeout(this.timer);
      }
    }));

    const steps = this.steps;
    const bezier = new CubicBezier(.36, .66, .04, 1);
    this.subs.push(this.viewStateService.state.subscribe((state: ViewState) => {
      this.state = state;
    }));
    this.subs.push(this.viewStateService.touchProgress.subscribe(p => {
      const progress = bezier.update(p / steps);
      const n: number = p / 50;
      let m: number;
      if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
        this.translate = `translate3d(${p / steps * this.translateDistance}px, 0, 0)`;
        m = 1 - n;
        this.opacity = m < 0 ? 0 : m;
      } else if (this.state === ViewState.ToStack) {
        this.translate = `translate3d(${-50 + 50 * p / steps}%, 0, 0)`;
        m = progress * 2;
        this.opacity = m > 1 ? 1 : m;
      }
    }));
    this.subs.push(this.viewStateService.progress.subscribe((p: number) => {
      const progress = bezier.update(p / steps);

      const n: number = p / 50;
      let m: number;
      switch (this.state) {
        case ViewState.Activate:
          this.opacity = 1;
          const distance = this.translateDistance - progress * this.translateDistance;
          this.translate = `translate3d(${distance}px, 0, 0)`;
          break;
        case ViewState.Destroy:
          this.opacity = 1;
          this.translate = `translate3d(${this.translateDistance * progress}px, 0, 0)`;
          break;
        case ViewState.ToStack:
          this.translate = `translate3d(${-progress * 100}%, 0, 0)`;
          m = 1 - n;
          this.opacity = m < 0 ? 0 : m;
          break;
        case ViewState.Reactivate:
          this.translate = `translate3d(${-50 + progress * 50}%, 0, 0)`;
          m = progress * 2;
          this.opacity = m > 1 ? 1 : m;
          break;
      }
    }));
  }

  ngAfterViewInit() {
    this.docWidth = this.document.body.offsetWidth;
    this.contentWidth = this.textElement.nativeElement.offsetWidth;
    this.leftDistance = this.textElement.nativeElement.offsetLeft;
    this.translateDistance = this.docWidth / 2 - (this.leftDistance + 10 * this.scale) - this.contentWidth / 2;
  }

  ngOnDestroy() {
    this.subs.forEach(item => {
      item.unsubscribe();
    });
  }
}