import { Component } from '@angular/core';
import { ToastController } from '../../modules/index';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component {
    progress: number = 0;

    index: number = 0;

    constructor(private toast: ToastController) {
    }

    dragging(progress: number) {
        this.progress = progress;
    }

    refresh(fn: () => void) {
        setTimeout(() => {
            fn();
        }, 3000);
    }

    show() {
        this.toast.push({
            content: 'fdsfdsa'
        });
    }
}