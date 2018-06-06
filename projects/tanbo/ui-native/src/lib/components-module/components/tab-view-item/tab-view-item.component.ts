import { Component, HostBinding, Input, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TabViewItemService } from './tab-view-item.service';
import { ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-tab-view-item',
    templateUrl: './tab-view-item.component.html',
    providers: [
        TabViewItemService
    ]
})
export class TabViewItemComponent implements OnDestroy, OnInit {
    @HostBinding('class.ui-active')
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
    private subs: Array<Subscription> = [];

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private viewStateService: ViewStateService,
                private tabViewItemService: TabViewItemService) {
    }

    ngOnInit() {
        this.subs.push(this.viewStateService.state.subscribe(state => {
            if (this.active) {
                this.tabViewItemService.changeState(state);
            }
        }));
        this.subs.push(this.viewStateService.progress.subscribe(p => {
            if (this.active) {
                this.tabViewItemService.updateProgress(p);
            }
        }));
        this.subs.push(this.viewStateService.touchProgress.subscribe(p => {
            if (this.active) {
                this.tabViewItemService.touching(p);
            }
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => item.unsubscribe());
    }
}