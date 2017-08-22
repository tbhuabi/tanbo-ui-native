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

    private subs: Array<Subscription> = [];

    constructor(private navController: NavController) {
    }

    ngOnInit() {
        this.subs.push(this.navController.pushEvent$.subscribe((component: any) => {
            const length = this.views.length;
            if (length) {
                let lastView = this.views[length - 1];
                lastView.state = ViewState.ToStack;
                this.views.push({
                    state: ViewState.Init,
                    component
                });
            } else {
                this.views.push({
                    state: null,
                    component
                });
            }
        }));
        this.subs.push(this.navController.popEvent$.subscribe(() => {
            const length = this.views.length;
            if (length) {
                this.views[length - 1].state = ViewState.Destroy;

                if (length > 1) {
                    this.views[length - 2].state = null;
                }
            }
        }));
        this.subs.push(this.navController.destroyAction$.subscribe(() => {
            this.views.pop();
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }
}