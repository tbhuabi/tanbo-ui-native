import { Component } from '@angular/core';
import { AlertController, ConfirmController, NavController } from '../../modules/index';

import { Page1Component } from '../page1/page1.component';

@Component({
    templateUrl: './root-page.component.html',
    styleUrls: ['./root-page.component.scss']
})
export class RootPageComponent {
    isLoading: boolean = false;
    progress: number = 0;
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

    rolling(event: number) {
        this.isLoading = false;
        this.progress = event;
    }

    refresh(fn: any) {
        console.log(4444);
        this.isLoading = true;
        setTimeout(() => {
            this.isLoading = false;
            fn();
        }, 4000);
    }

    infinite() {
        console.log('infinite');
    }
}