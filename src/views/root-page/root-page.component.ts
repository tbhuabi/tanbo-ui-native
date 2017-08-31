import { Component } from '@angular/core';
import { AlertController, ConfirmController, NavController } from '../../modules/index';

import { Page1Component } from '../page1/page1.component';

@Component({
    templateUrl: './root-page.component.html',
    styleUrls: ['./root-page.component.scss']
})
export class RootPageComponent {
    title: string | number = '首页';

    constructor(private navController: NavController,
                private alertController: AlertController,
                private confirmController: ConfirmController) {
    }

    goToPage1() {
        this.navController.push(Page1Component);
    }

    test() {
        this.alertController.show({
            title: 'test',
            content: 'content'
        });
    }

    show(event: any) {
        console.log(event);
    }
}