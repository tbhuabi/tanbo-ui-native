import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ListEventService } from './list-event.service';

@Component({
    selector: 'ui-list-item',
    templateUrl: './list-item.component.html',
    providers: [
        ListEventService
    ]
})
export class ListItemComponent implements OnInit, OnDestroy {

    @HostBinding('class.focus')
    isFocus: boolean = false;

    private sub: Subscription;

    constructor(private listEventService: ListEventService) {
    }

    ngOnInit() {
        this.sub = this.listEventService.focusEvent$.subscribe((state: boolean) => {
            this.isFocus = state;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}