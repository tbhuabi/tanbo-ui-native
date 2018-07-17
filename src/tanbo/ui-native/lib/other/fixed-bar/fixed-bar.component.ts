import { Component, Optional, OnInit, OnDestroy, ElementRef, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';

import { FixedBarService } from './fixed-bar.service';

@Component({
  selector: 'ui-fixed-bar',
  templateUrl: './fixed-bar.component.html'
})
export class FixedBarComponent implements OnInit, OnDestroy {
  offset: number = 0;
  @HostBinding('class.ui-fixed')
  fixed: boolean = false;
  private subs: Subscription[] = [];

  constructor(@Optional() private fixedBarService: FixedBarService,
              private elementRef: ElementRef) {
  }

  ngOnInit() {
    if (this.fixedBarService) {
      this.subs.push(this.fixedBarService.onScroll.subscribe((scrollTop: number) => {
        this.fixed = this.elementRef.nativeElement.offsetTop < (scrollTop + this.offset);
      }));
    }
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }
}