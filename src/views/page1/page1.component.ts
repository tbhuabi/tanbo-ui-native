import { Component } from '@angular/core';
import { UIRouter } from '../../modules/index';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component {
    constructor(private uiRouter: UIRouter) {
    }

    toPage() {
        this.uiRouter.navigateByUrl('/page2');
    }
}