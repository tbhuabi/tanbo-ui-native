import { Component } from '@angular/core';
import { TabController } from './tab-controller';

@Component({
  selector: 'ui-tab',
  templateUrl: './tab.component.html',
  providers: [
    TabController
  ]
})
export class TabComponent {
}