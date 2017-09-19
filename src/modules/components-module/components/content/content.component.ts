import { Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ViewStateService } from '../view/view-state.service';

@Component({
    selector: 'ui-content',
    templateUrl: './content.component.html'
})
export class ContentComponent implements OnInit, OnDestroy {
    @HostBinding('class.has-popover')
    state: boolean = false;
    private sub: Subscription;

    constructor(private viewStateService: ViewStateService) {
    }

    ngOnInit() {
        this.sub = this.viewStateService.popoverState$.subscribe((state: boolean) => {
            this.state = state;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }
}