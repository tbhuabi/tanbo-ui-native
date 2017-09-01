import { Component } from '@angular/core';

import { ListEventService } from './list-event.service';

@Component({
    selector: 'ui-list-item',
    templateUrl: './list-item.component.html',
    providers: [
        // 提供一个服务，供 list-sliding 组件发起通信
        ListEventService
    ]
})
export class ListItemComponent {
}