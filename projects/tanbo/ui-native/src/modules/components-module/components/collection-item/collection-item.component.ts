import { Component } from '@angular/core';
import { PullDownRefreshController } from '../../controllers/pull-down-refresh-controller';
import { PullUpLoadController } from '../../controllers/pull-up-load-controller';

@Component({
    selector: 'ui-collection-item',
    templateUrl: './collection-item.component.html',
    providers: [
        PullDownRefreshController,
        PullUpLoadController
    ]
})
export class CollectionItemComponent {

}