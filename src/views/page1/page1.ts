import { Component } from '@angular/core';

import { NavController } from '../../modules/index';

import { Page2Component } from '../page2/page2';

@Component({
    templateUrl: './page1.html'
})
export class Page1Component {
    constructor(private navController: NavController) {
    }

    toPage() {
        this.navController.push(Page2Component);
    }
}