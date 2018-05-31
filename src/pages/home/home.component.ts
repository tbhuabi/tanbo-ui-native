import { Component, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AlertController } from '../../modules/index';

@Component({
    templateUrl: './home.component.html'
})
export class HomeComponent implements AfterContentInit {
    formGroup: FormGroup;
    constructor(private alert: AlertController,
                private fb: FormBuilder) {
        this.formGroup = this.fb.group({
            name: 'aaa'
        });
    }

    ngAfterContentInit() {
        // this.alert.show({
        //     title: 'test',
        //     content: 'aaaa'
        // }).then(() => {
        //     alert(333);
        // });
    }
}