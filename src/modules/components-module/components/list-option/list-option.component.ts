import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ListEventService } from '../list-item/list-event.service';

@Component({
    selector: 'ui-list-option',
    templateUrl: './list-option.component.html'
})
export class ListOptionComponent implements AfterViewInit {
    constructor(private listEventService: ListEventService,
                private elementRef: ElementRef) {
    }

    ngAfterViewInit() {
        this.listEventService.addOption(this.elementRef);
    }
}