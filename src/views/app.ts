import { Component } from '@angular/core';
import { AlertController, ConfirmController, ToastController } from '../modules/index';

@Component({
    selector: 'ui-test',
    templateUrl: 'app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {
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
