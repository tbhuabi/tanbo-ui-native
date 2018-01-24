import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component implements OnInit {
    progress: number = 0;

    ngOnInit() {
        console.log('page1');
    }

    pan(event: any) {
        console.log(event.deltaX);
        // console.log(event.additionalEvent , event.distance);
    }

    drag(n: number) {
        this.progress = n;
    }
}