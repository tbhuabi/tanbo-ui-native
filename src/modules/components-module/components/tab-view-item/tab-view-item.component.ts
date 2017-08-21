import { AfterViewInit, Component, HostBinding, Input } from '@angular/core';

import { NavController } from '../navigation/navigation-controller.service';

@Component({
    selector: 'ui-tab-view-item',
    templateUrl: './tab-view-item.component.html',
    providers: [
        NavController
    ]
})
export class TabViewItemComponent implements AfterViewInit {
    @Input()
    rootPage: any;

    @HostBinding('class.active')
    isActive: boolean = false;

    constructor(private navController: NavController) {
    }

    ngAfterViewInit() {
        this.navController.push(this.rootPage);
    }
}