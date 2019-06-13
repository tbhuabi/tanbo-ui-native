import { Component } from '@angular/core';
import { PullDownRefreshController, PullUpLoadController } from '../../scroll/index';

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