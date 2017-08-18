import { Component } from '@angular/core';

import { ListEventService } from './list-event.service';

@Component({
    selector: 'ui-list-item',
    templateUrl: './list-item.component.html',
    providers: [
        ListEventService
    ]
})
export class ListItemComponent {
}