import { Component } from '@angular/core';
import { NavController } from '../../../../modules/index';
import { Child4Component } from '../child2/child2';

@Component({
    templateUrl: './child.html'
})
export class Child3Component {
    constructor(private nav: NavController) {
    }

    toPage() {
        this.nav.push(Child4Component);
    }
}