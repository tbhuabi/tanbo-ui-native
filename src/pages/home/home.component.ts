import { Component, AfterContentInit } from '@angular/core';

import { AlertController } from '../../modules/index';

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent implements AfterContentInit {
    constructor(private alert: AlertController) {
    }

    ngAfterContentInit() {
        this.alert.show({
            title: 'test',
            content: 'aaaa'
        }).then(() => {
            alert(333);
        });
    }
}