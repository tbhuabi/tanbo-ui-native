import { Component, ContentChildren, QueryList, AfterContentInit, Input, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TabService } from '../tab/tab.service';
import { TabBarItemComponent } from '../tab-bar-item/tab-bar-item.component';

@Component({
    selector: 'ui-tab-bar',
    templateUrl: './tab-bar.component.html'
})
export class TabBarComponent implements AfterContentInit, OnDestroy {
    @Input()
    tabIndex: number = 0;

    @ContentChildren(TabBarItemComponent)
    tabBarItems: QueryList<TabBarItemComponent>;

    private sub: Subscription;
    private subs: Array<Subscription> = [];

    constructor(private tabService: TabService) {
    }

    ngAfterContentInit() {
        this.tabBarItems.forEach((item: TabBarItemComponent, index: number) => {
            let sub = item.selected.subscribe(() => {
                this.tabService.publishIndex(index);
            });
            this.subs.push(sub);
        });
        this.sub = this.tabService.tabIndex$.subscribe((index: number) => {
            this.tabBarItems.forEach((item: TabBarItemComponent, i: number) => {
                item.isActive = i === index;
            });
        });

        this.tabService.publishIndex(this.tabIndex);
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }
}