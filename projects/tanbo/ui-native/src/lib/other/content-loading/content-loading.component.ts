import { Component, OnDestroy, OnInit, HostBinding } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ContentLoadingController } from './content-loading.service';

@Component({
  selector: 'ui-content-loading',
  templateUrl: './content-loading.component.html',
  animations: [
    trigger('loadingAnimate', [transition(':enter', animate('5s', keyframes([
      style({
        opacity: 0,
        offset: 0
      }),
      style({
        opacity: 1,
        offset: 1
      })
    ]))), transition(':leave', animate('0.15s', keyframes([
      style({
        opacity: 1,
        offset: 0
      }),
      style({
        opacity: 0,
        offset: 1
      })
    ])))])
  ]
})
export class ContentLoadingComponent implements OnInit, OnDestroy {
  show: boolean = false;
  text: string = '';
  @HostBinding('class.ui-content-loading-fadein') fadeIn: boolean = false;
  @HostBinding('class.ui-content-loading-fadeout') fadeOut: boolean = false;
  private subs: Array<Subscription> = [];
  private timer: any = null;

  constructor(private contentLoadingController: ContentLoadingController) {
  }

  ngOnInit() {
    this.subs.push(this.contentLoadingController.showLoading.subscribe((text?: string) => {
      this.fadeOut = false;
      this.fadeIn = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.show = true;
        this.text = text;
      });
    }));

    this.subs.push(this.contentLoadingController.hideLoading.subscribe(() => {
      this.fadeIn = false;
      this.fadeOut = true;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.show = false;
        this.text = '';
      }, 150);
    }));
  }

  ngOnDestroy() {
    clearTimeout(this.timer);
    this.subs.forEach(item => {
      item.unsubscribe();
    });
  }
}