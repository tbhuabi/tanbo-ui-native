import { Component } from '@angular/core';
import { NavController } from '../../../../modules/index';
import { Child2Component } from '../child2/child2';

import { PageTransferStationService } from '../../../../services/page-transfer-station';
import { Page1Component } from '../../../page1/page1';

@Component({
    templateUrl: './child.html',
    styleUrls: ['./child.scss']
})
export class ChildComponent {
    constructor(private nav: NavController, private pageTransferStationService: PageTransferStationService) {

    }

    toPage() {
        console.log(this.nav);
        this.nav.push(Child2Component);
    }

    toPage2() {
        this.pageTransferStationService.push({
            component: Page1Component
        });
    }
}