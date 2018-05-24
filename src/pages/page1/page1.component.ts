import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component implements OnInit {
    index: number = 0;

    list: any[] = [];

    ngOnInit() {
        setTimeout(() => {
            this.list.push({
                color: 'darkcyan',
                value: 22222
            });
            this.list.push({
                color: '#a6aab1',
                value: 33333
            });
        }, 1000);
    }

    setIndex(n: number) {
        this.index = n;
    }

    uiOnViewEnter() {
        console.log('page1 enter');
    }

    uiOnViewLeave() {
        console.log('page1 leave');
    }
}