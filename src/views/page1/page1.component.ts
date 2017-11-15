import { Component } from '@angular/core';
import { UIRouter } from '../../modules/index';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component {
    progress: number = 0;

    constructor(private uiRouter: UIRouter) {
    }

    dragging(progress: number) {
        this.progress = progress;
    }

    refresh(fn: () => void) {
        setTimeout(() => {
            fn();
        }, 3000);
    }

    toPage() {
        this.uiRouter.navigateByUrl('/page2');
    }
}