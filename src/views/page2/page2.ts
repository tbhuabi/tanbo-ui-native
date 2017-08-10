import { Component } from '@angular/core';

import { NavController } from '../../modules/index';

import { Page3Component } from '../page3/page3';

@Component({
    templateUrl: './page2.html'
})
export class Page2Component {
    constructor(private navController: NavController) {
    }

    toPage() {
        this.navController.push(Page3Component);
    }
}