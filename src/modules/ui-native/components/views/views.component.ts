import { Component, OnInit, Renderer2 } from '@angular/core';
import { trigger } from '@angular/animations';

import { LifeCycleService } from './life-cycle.service';
import { NavController, ViewConfig } from './navigation-controller';
import { EventType } from '../../utils/event';
import { AnimationType } from '../../utils/animation-type';
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
                private renderer: Renderer2,
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

    touch($event: any, item: any) {
        $event.stopPropagation();
        if (this.views.length < 2) {
            return;
        }

        const touch = $event.targetTouches[0];
        const oldX = touch.pageX;
        const oldY = touch.pageY;
        const styles = item.styles;
        const state = AnimationType[item.viewConfig.transition.activate];
        if (!item.state) {
            return;
        }

        let prevItem = this.views[this.views.length - 2];

        const createSetStyleFn = function (state: string, oldX: number, oldY: number) {
            switch (true) {
                case /InLeft$/.test(state):
                    return function (event: any) {
                        const touch = event.targetTouches[0];

                        let distanceX = touch.pageX - oldX;
                        if (distanceX > 0) {
                            distanceX = 0;
                        }
                        styles.transform = `translateX(${distanceX}px)`;
                    };
                case /InRight$/.test(state):
                    return function (event: any) {
                        const touch = event.targetTouches[0];

                        let distanceX = touch.pageX - oldX;
                        if (distanceX < 0) {
                            distanceX = 0;
                        }
                        styles.transform = `translateX(${distanceX}px)`;
                        let v = distanceX / 320 * 30;
                        prevItem.styles.transform = `translateX(${v + -30}%)`;
                    };
                case /InUp$/.test(state):
                    return function (event: any) {
                        const touch = event.targetTouches[0];

                        let distanceY = touch.pageY - oldY;
                        if (distanceY < 0) {
                            distanceY = 0;
                        }
                        styles.transform = `translateY(${distanceY}px)`;
                    };
                case /InDown$/.test(state):
                    return function (event: any) {
                        const touch = event.targetTouches[0];

                        let distanceY = touch.pageY - oldY;
                        if (distanceY > 0) {
                            distanceY = 0;
                        }
                        styles.transform = `translateY(${distanceY}px)`;
                    };
            }
        };

        styles.transition = '0ms';

        let fn = createSetStyleFn(state, oldX, oldY);
        let isMoved = false;

        const clearMoveFn = this.renderer.listen('document', 'touchmove', (event: any) => {
            isMoved = true;
            fn(event);
        });

        const clearUpFn = this.renderer.listen('document', 'touchend', () => {
            if (isMoved) {
                styles.transform = `translateX(0px) translateY(0px)`;
                styles.transition = '300ms';
            }
            clearMoveFn();
            clearUpFn();
        });
    }

    transitionEnd(item: any) {
        item.styles.transition = '0ms';
    }
}