import { Component, OnInit } from '@angular/core';
import { AlertController, ConfirmController, NavController } from '../../modules/index';

import { Page1Component } from '../page1/page1.component';

@Component({
    templateUrl: './root-page.component.html',
    styleUrls: ['./root-page.component.scss']
})
export class RootPageComponent implements OnInit {
    items: Array<any> = [];
    test: number = 0;
    progress: number = 0;

    constructor(private navController: NavController,
                private alertController: AlertController,
                private confirmController: ConfirmController) {
    }

    ngOnInit() {

        let getNumber = function () {
            return Math.floor(Math.random() * 255);
        };

        for (let i = 0; i < 3; i++) {

            this.items.push({
                background: `rgb(${getNumber()},${getNumber()},${getNumber()})`
            });
        }
    }
    rolling(progress: number) {
        this.progress = progress;
    }

    show(str: string) {
        // console.log(str);
    }

    change() {
        console.log('change');
        this.test = 0;

        setTimeout(() => {
            console.log(this.test);
        }, 300);
    }

    goToPage1() {
        this.navController.push(Page1Component);
    }
}