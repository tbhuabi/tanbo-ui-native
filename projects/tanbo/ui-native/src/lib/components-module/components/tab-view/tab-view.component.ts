import { AfterContentInit, Component, ContentChildren, QueryList, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TabService } from '../tab/tab.service';
import { TabViewItemComponent } from '../tab-view-item/tab-view-item.component';

@Component({
    selector: 'ui-tab-view',
    templateUrl: './tab-view.component.html'
})
export class TabViewComponent implements AfterContentInit, OnDestroy {
    @ContentChildren(TabViewItemComponent)
    tabViewItems: QueryList<TabViewItemComponent>;

    private subs: Array<Subscription> = [];

    constructor(private tabService: TabService) {
    }

    ngAfterContentInit() {
        // 订阅tab切换事件，如果发生切换，显示/隐藏对应视图
        this.subs.push(this.tabService.tabIndex.subscribe((index: number) => {
            this.tabViewItems.forEach((item: TabViewItemComponent, i: number) => {
                item.active = i === index;
            });
        }));
        // 初始化时，默认为第一项
        const items = this.tabViewItems.toArray();
        if (items[0]) {
            items[0].active = true;
        }
    }

    ngOnDestroy() {
        this.subs.forEach(item => item.unsubscribe());
    }
}