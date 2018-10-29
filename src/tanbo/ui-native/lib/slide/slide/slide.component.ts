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
  Renderer2, EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Easing } from '@tweenjs/tween.js';

import { UI_SCREEN_SCALE } from '../../helper';
import { AppController } from '../../app/index';
import { SlideItemComponent } from '../slide-item/slide-item.component';
import { PanEvent } from '../../touch';


@Component({
  selector: 'ui-slide',
  templateUrl: './slide.component.html'
})

export class SlideComponent implements OnInit, AfterViewInit, OnDestroy{
  @ContentChildren(SlideItemComponent) items: QueryList<SlideItemComponent>;
  @Output() uiPlayed = new EventEmitter<number>();
  @Input() initIndex = 0;
  @Input() speed = 2000;
  @Input() steps = 35;

  @Input()
  set autoPlay(v: boolean) {
    this._autoPlay = v;
    if (v) {
      this.play();
    }
  }

  get autoPlay() {
    return this._autoPlay;
  }

  get index(): number {
    return Math.ceil(this.progress - 0.5) % this.items.length;
  }

  private progress: number = 0;
  private oldProgress: number = 0;
  private timer: any = null;
  private animateId: number;
  private containerWidth: number;
  private subs: Subscription[] = [];
  private _autoPlay = true;

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

  touch(event: PanEvent) {
    clearTimeout(this.timer);
    cancelAnimationFrame(this.animateId);
    event.srcEvent.stopPropagation();
    const firstDirection = event.firstDirection;
    const durationTime = event.durationTime;
    const element = this.elementRef.nativeElement;
    this.containerWidth = element.offsetWidth;
    const len = this.items.length;
    const distanceX = event.distanceX;
    const isFirstMoving = event.first;
    const autoUpdateStyle = () => {
      let min = 0;
      const max = 20;
      const p = this.progress;
      let target: number;
      if (durationTime < 200 && Math.abs(distanceX) > 20 * this.scale) {
        console.log('快速')
        target = distanceX > 0 ? Math.floor(p) : Math.floor(p) + 1;
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
    if (this.items.length < 2) {
      return;
    }
    if (firstDirection === 'up' || firstDirection === 'down') {
      event.stop();
      return;
    }
    if (isFirstMoving) {
      this.oldProgress = this.progress;
    }
    this.progress = this.oldProgress - (distanceX) / this.containerWidth;
    if (this.progress < 0) {
      this.progress += len;
    }

    this.updateChildrenStyle(this.progress);

    if (event.type === 'touchend') {
      autoUpdateStyle();
    }
    if (firstDirection === 'left' || firstDirection === 'right') {
      event.srcEvent.preventDefault();
      return false;
    }
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