import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component implements OnInit {
    data: string[] = [];

    state: string = '';

    ngOnInit() {
        setTimeout(() => {
            this.data = ['ccc', 'ddd'];
        }, 2000);
    }

    setState() {
        this.data = ['aaa', 'bbb'];
    }
}