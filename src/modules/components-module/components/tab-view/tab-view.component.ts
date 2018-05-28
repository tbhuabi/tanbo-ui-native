import { AfterContentInit, Component, ContentChildren, QueryList, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TabService } from '../tab/tab.service';
import { TabViewItemComponent } from '../tab-view-item/tab-view-item.component';
import { ViewStateService } from '../view/view-state.service';
import { TabViewService } from './tab-view.service';

@Component({
    selector: 'ui-tab-view',
    templateUrl: './tab-view.component.html',
    providers: [
        TabViewService
    ]
})
export class TabViewComponent implements AfterContentInit, OnDestroy {
    @ContentChildren(TabViewItemComponent)
    tabViewItems: QueryList<TabViewItemComponent>;

    private subs: Array<Subscription> = [];

    constructor(private tabService: TabService,
                private tabViewService: TabViewService,
                private viewStateService: ViewStateService) {
    }

    ngAfterContentInit() {
        this.subs.push(this.viewStateService.state.subscribe(state => {
            this.tabViewService.changeState(state);
        }));
        this.subs.push(this.viewStateService.progress.subscribe(p => {
            this.tabViewService.updateProgress(p);
        }));
        this.subs.push(this.viewStateService.touchProgress.subscribe(p => {
            this.tabViewService.touching(p);
        }));

        // 订阅tab切换事件，如果发生切换，显示/隐藏对应视图
        this.subs.push(this.tabService.tabIndex$.subscribe((index: number) => {
            this.tabViewItems.forEach((item: TabViewItemComponent, i: number) => {
                item.active = i === index;
            });
        }));
        // 初始化时，默认为第一项
        let items = this.tabViewItems.toArray();
        if (items[0]) {
            items[0].active = true;
        }
    }

    ngOnDestroy() {
        this.subs.forEach(item => item.unsubscribe());
    }
}