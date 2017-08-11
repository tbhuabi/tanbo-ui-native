import { Component, ContentChildren, QueryList, AfterContentInit } from '@angular/core';
import { TabService } from '../tab/tab.service';
import { TabViewItemComponent } from '../tab-view-item/tab-view-item.component';

@Component({
    selector: 'ui-tab-view',
    templateUrl: './tab-view.component.html'
})
export class TabViewComponent implements AfterContentInit {
    @ContentChildren(TabViewItemComponent)
    tabViewItems: QueryList<TabViewItemComponent>;

    constructor(private tabService: TabService) {
    }

    ngAfterContentInit() {
        this.tabService.tabIndex$.subscribe((index: number) => {
            this.tabViewItems.forEach((item: TabViewItemComponent, i: number) => {
                item.isActive = i === index;
            });
        });
        let items = this.tabViewItems.toArray();
        if (items[0]) {
            items[0].isActive = true;
        }
    }
}