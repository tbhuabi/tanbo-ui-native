import { Component, OnInit } from '@angular/core';
import { AlertController, ConfirmController, ContentLoadingController, NavController } from '../../modules/index';

import { Page1Component } from '../page1/page1.component';

@Component({
    templateUrl: './root-page.component.html',
    styleUrls: ['./root-page.component.scss']
})
export class RootPageComponent implements OnInit {

    isShow: boolean = false;
    items: Array<any> = [];
    test: number = 0;
    progress: number = 0;

    constructor(private navController: NavController,
                private alertController: AlertController,
                private pageLoadingController: ContentLoadingController,
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

    showLoading() {
        this.pageLoadingController.show();
    }

    hideLoading() {
        this.pageLoadingController.hide();
    }

    show() {
        this.confirmController.show({
            title: 'title',
            content: 'content'
        });
    }

    change() {
        this.isShow = !this.isShow;
    }

    goToPage1() {
        this.navController.push(Page1Component);
    }
}