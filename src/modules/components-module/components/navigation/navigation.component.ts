import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NavController } from './navigation-controller.service';
import { ViewState } from '../view/view-state.service';

@Component({
    selector: 'ui-navigation',
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements OnInit, OnDestroy {
    views: Array<any> = [];
    openAnimation: boolean = true;

    private subs: Array<Subscription> = [];

    constructor(private navController: NavController) {
    }

    ngOnInit() {
        // 订阅导航事件，并设置相应动画状态
        this.subs.push(this.navController.pushEvent$.subscribe((component: any) => {
            this.openAnimation = true;
            const length = this.views.length;
            if (length) {
                let lastView = this.views[length - 1];
                lastView.state = ViewState.ToStack;
                this.views.push({
                    state: ViewState.Activate,
                    component
                });
            } else {
                this.views.push({
                    state: null,
                    component
                });
            }

            let sleepViewSize = this.views.length - 3;
            while (sleepViewSize > -1) {
                this.views[sleepViewSize].state = ViewState.Sleep;
                sleepViewSize--;
            }
        }));
        // 当导航回退时，设置相应动画状态
        this.subs.push(this.navController.popEvent$.subscribe(() => {
            this.openAnimation = true;
            const length = this.views.length;
            if (length) {
                this.views[length - 1].state = ViewState.Destroy;

                if (length > 1) {
                    this.views[length - 2].state = ViewState.Reactivate;
                }
            }
        }));
        // 当回退动画完成时，删除对应视图
        this.subs.push(this.navController.destroyAction$.subscribe(() => {
            const length = this.views.length;
            if (length > 1) {
                this.views.pop();
            }
            if (length > 2) {
                this.views[length - 3].state = ViewState.ToStack;
            }
        }));

        // 当用户触摸触发返回时，更新视图状态
        this.subs.push(this.navController.moveBackProgress$.subscribe(progress => {
            this.openAnimation = false;
            if (progress === 100) {

                const length = this.views.length;
                if (length === 1) {
                    return;
                }
                this.views.pop();
                if (length > 1) {
                    this.views[length - 2].state = ViewState.Reactivate;
                }
                if (length > 2) {
                    this.views[length - 3].state = ViewState.ToStack;
                }
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }
}