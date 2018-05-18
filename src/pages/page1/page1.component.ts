import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component implements OnInit {
    index: number = 1;
    tabIndex: number = 1;

    tab(n: number) {
        this.tabIndex = n;
    }

    ngOnInit() {

    }

    setIndex(n: number) {
        this.index = n;
    }
}