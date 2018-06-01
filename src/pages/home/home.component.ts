import { Component, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { AlertController, UI_SELECT_ARROW_CLASSNAME } from '../../modules/index';

@Component({
    templateUrl: './home.component.html',
    styles: [`
    ui-input, ui-select, ui-picker {
        background-color:#fff;
    }
    `],
    providers: [{
        provide: UI_SELECT_ARROW_CLASSNAME,
        useValue: 'ui-icon-arrow-right'
    }]
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