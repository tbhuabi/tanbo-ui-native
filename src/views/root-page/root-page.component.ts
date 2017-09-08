import { Component, OnInit } from '@angular/core';

@Component({
    templateUrl: './root-page.component.html',
    styleUrls: ['./root-page.component.scss']
})
export class RootPageComponent implements OnInit {
    items: Array<any> = [];

    ngOnInit() {

        let getNumber = function () {
            return Math.floor(Math.random() * 255);
        };

        for (let i = 0; i < 3; i++) {

            this.items.push({
                background: `rgb(${getNumber()},${getNumber()},${getNumber()})`
            })
        }
    }

    show(str: string) {
        console.log(str);
    }
}