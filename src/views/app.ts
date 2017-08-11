import { Component } from '@angular/core';
import { AlertController, ConfirmController, ToastController } from '../modules/index';

import { RootPageComponent } from './root-page/root-page.component';

@Component({
    selector: 'ui-test',
    templateUrl: 'app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {
    rootPage: any = RootPageComponent;
    date: string = 'fdsa';

    constructor(private confirmController: ConfirmController,
                private toastController: ToastController,
                private alertController: AlertController) {
    }

    show() {
        this.alertController.show({
            title: 'title',
            content: 'content'
        }).then(() => {
            console.log(333);
        });
    }

    confirm() {
        this.confirmController.show({
            title: 'title',
            content: 'content'
        }).then(() => {
            console.log(444);
        });
    }

    notify() {
        this.toastController.push({
            content: 'fdsafd'
        });
    }
}
