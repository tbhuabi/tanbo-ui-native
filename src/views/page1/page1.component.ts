import { Component } from '@angular/core';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component {
    progress: number = 0;

    dragging(progress: number) {
        this.progress = progress;
    }

    refresh(fn: () => void) {
        setTimeout(() => {
            fn();
        }, 3000);
    }
}