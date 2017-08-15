import { Component, OnInit } from '@angular/core';
import { trigger } from '@angular/animations';

import { LifeCycleService } from './life-cycle.service';
import { NavController, ViewConfig } from './navigation-controller';
import { EventType } from './event';
import { AnimationType } from './animation-type';
import { pageTransitionAnimate } from './view-transition-animate';

@Component({
    selector: 'ui-views',
    templateUrl: './views.component.html',
    animations: [trigger('pageAnimations', pageTransitionAnimate)],
    providers: [
        LifeCycleService
    ]
})
export class ViewsComponent implements OnInit {
    views: Array<any> = [];

    constructor(private navController: NavController,
                private lifeCycleService: LifeCycleService) {
    }

    ngOnInit() {
        this.navController.pushEvent$.subscribe((viewConfig: ViewConfig) => {
            let lastItem = this.views[this.views.length - 1];
            if (lastItem) {
                lastItem.state = AnimationType[viewConfig.transition.toStack];
            }
            this.views.push({
                viewConfig,
                state: this.views.length ? AnimationType[viewConfig.transition.activate] : '',
                styles: {}
            });
        });

        this.navController.popEvent$.subscribe(() => {

            let lastItem = this.views[this.views.length - 1];
            if (lastItem) {
                lastItem.state = AnimationType[lastItem.viewConfig.transition.destroy];
            }
            let currentItem = this.views[this.views.length - 2];
            if (currentItem) {
                currentItem.state = AnimationType[lastItem.viewConfig.transition.reactivate];
            }
        });
    }

    destroy() {
        let lastItem = this.views[this.views.length - 1];
        if (lastItem && lastItem.state === AnimationType[lastItem.viewConfig.transition.destroy]) {
            this.views.pop();
        }
    }

    lifeCycle(item: any) {
        let enterStatus = [
            AnimationType[item.viewConfig.transition.reactivate],
            AnimationType[item.viewConfig.transition.activate],
            ''
        ];
        let leaveStatus = [
            AnimationType[item.viewConfig.transition.toStack],
            AnimationType[item.viewConfig.transition.destroy]
        ];
        if (enterStatus.indexOf(item.state) !== -1) {
            this.lifeCycleService.publishEvent({
                component: item.viewConfig.component,
                type: EventType.Enter
            });
        } else if (leaveStatus.indexOf(item.state) !== -1) {
            this.lifeCycleService.publishEvent({
                component: item.viewConfig.component,
                type: EventType.Leave
            });
        }
    }
}