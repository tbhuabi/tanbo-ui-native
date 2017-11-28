import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component implements OnInit {
    progress: number = 0;

    index: number = 0;

    ngOnInit() {
        setInterval(() => {
            this.index++;
        }, 1000);
    }

    dragging(progress: number) {
        this.progress = progress;
    }

    refresh(fn: () => void) {
        setTimeout(() => {
            fn();
        }, 3000);
    }
}