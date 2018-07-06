import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

import { UI_SELECT_ARROW_CLASSNAME } from '@tanbo/ui-native';

@Component({
    templateUrl: './home.component.html',
    providers: [{
        provide: UI_SELECT_ARROW_CLASSNAME,
        useValue: 'ui-icon-arrow-right'
    }]
})
export class HomeComponent {
    formGroup: FormGroup;
    constructor(private fb: FormBuilder) {
        this.formGroup = this.fb.group({
            name: 'aaa'
        });
    }

    show(n: any) {
        console.log(n);
    }
}