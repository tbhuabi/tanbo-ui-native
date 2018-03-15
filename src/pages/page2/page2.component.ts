import { Component, OnInit } from '@angular/core';

import { PickerCell } from '../../modules/index';

@Component({
    templateUrl: './page2.component.html'
})
export class Page2Component implements OnInit {
    data: Array<PickerCell> = [{
        text: '浙江',
        value: 1,
        children: [{
            text: '杭州',
            value: 10,
            children: [{
                text: '江干区',
                value: 100
            }, {
                text: '上城区',
                value: 101
            }]
        }]
    }, {
        text: '江苏',
        value: 2
    }, {
        text: '江苏',
        value: 2
    }, {
        text: '江苏',
        value: 2
    }, {
        text: '江苏',
        value: 2
    }, {
        text: '江苏',
        value: 2
    }];

    ngOnInit() {
        console.log('page2');
    }

    show(a: any) {
        console.log(a);
    }
}