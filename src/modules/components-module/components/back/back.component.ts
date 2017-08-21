import { Component, HostListener } from '@angular/core';

import { NavController } from '../navigation/navigation-controller.service';

@Component({
    selector: 'ui-back',
    templateUrl: './back.component.html'
})
export class BackComponent {
    constructor(private navController: NavController) {
    }

    @HostListener('click') click() {
        this.navController.pop();
    }
}