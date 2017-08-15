import { Component } from '@angular/core';
import { NavController } from '../../modules/index';

import { Page2Component } from '../page2/page2.component';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component {

    constructor(private navController: NavController) {
    }

    goToPage2() {
        this.navController.push(Page2Component);
    }
}