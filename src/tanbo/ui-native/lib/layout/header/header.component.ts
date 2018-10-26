import { Component, HostBinding, Inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { UI_ROUTER_ANIMATION_STEPS, ViewState, ViewStateService, UI_VIEW_INIT_STATE } from '../../router/index';

@Component({
  selector: 'ui-header',
  templateUrl: './header.component.html'
})

export class HeaderComponent implements OnInit, OnDestroy {
  @HostBinding('style.opacity') opacity: number;

  private subs: Array<Subscription> = [];

  constructor(private viewStateService: ViewStateService,
              @Inject(UI_VIEW_INIT_STATE) private state: ViewState,
              @Inject(UI_ROUTER_ANIMATION_STEPS) private steps: number) {
  }

  ngOnInit() {
    const steps = this.steps;
    this.subs.push(this.viewStateService.state.subscribe(state => {
      this.state = state;
    }));
    this.subs.push(this.viewStateService.touchProgress.subscribe(p => {
      if (this.state === ViewState.Activate || this.state === ViewState.Reactivate) {
        this.opacity = 1 - p / steps;
      }
    }));
    this.subs.push(this.viewStateService.progress.subscribe((p: number) => {
      switch (this.state) {
        case ViewState.Activate:
          this.opacity = p / steps;
          break;
        case ViewState.Destroy:
          this.opacity = 1 - p / steps;
          break;
        case ViewState.ToStack:
        case ViewState.Reactivate:
          this.opacity = 1;
          break;
      }
    }));
  }

  ngOnDestroy() {
    this.subs.forEach(item => item.unsubscribe());
  }
}