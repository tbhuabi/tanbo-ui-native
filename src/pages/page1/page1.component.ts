import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component implements OnInit {
    data: string[] = [];

    ngOnInit() {
        // setTimeout(() => {
        //     this.date = '2018-03-12'
        // }, 2000);
    }

    setState() {
        this.data = ['aaa', 'bbb'];
    }
}