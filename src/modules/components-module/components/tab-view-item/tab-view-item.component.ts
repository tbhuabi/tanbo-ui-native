import { Component, HostBinding, Input, ChangeDetectorRef } from '@angular/core';

import { TabViewItemService } from './tab-view-item.service';

@Component({
    selector: 'ui-tab-view-item',
    templateUrl: './tab-view-item.component.html',
    providers: [
        TabViewItemService
    ]
})
export class TabViewItemComponent {
    @HostBinding('class.active')
    set active(value: boolean) {
        this._active = value;
        this.tabViewItemService.change(value);
        if (value) {
            this.isInit = true;
            this.changeDetectorRef.reattach();
        } else {
            this.changeDetectorRef.detach();
            if (this.isInit) {
                this.changeDetectorRef.detectChanges();
            }
        }
    }

    get active() {
        return this._active;
    }

    @Input()
    name: string;

    private _active: boolean = false;
    private isInit: boolean = false;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private tabViewItemService: TabViewItemService) {
    }
}