import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component implements OnInit {
    date: string = '';

    ngOnInit() {
        // setTimeout(() => {
        //     this.date = '2018-03-12'
        // }, 2000);
    }

    setDate() {
        this.date = '2018-03-12'
    }
}