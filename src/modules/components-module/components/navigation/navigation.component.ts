import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { NavController } from './navigation-controller.service';

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
            this.views.push(component);
        }));
        this.subs.push(this.navController.popEvent$.subscribe(() => {
            this.views.pop();
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }
}