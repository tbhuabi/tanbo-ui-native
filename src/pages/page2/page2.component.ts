import { Component, OnInit } from '@angular/core';

import { PickerCell } from '../../modules/index';

@Component({
    templateUrl: './page2.component.html'
})
export class Page2Component implements OnInit {
    data: Array<PickerCell> = [{
        text: '1浙江',
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
        text: '2江苏',
        value: 2
    }, {
        text: '3四川',
        value: 3,
        children: [{
            text: '成都',
            value: 30,
            children: [{
                text: '双流区',
                value: 301
            }, {
                text: '武侯区',
                value: 302
            }]
        }, {
            text: '广元',
            value: 31
        }]
    }, {
        text: '4河南',
        value: 4
    }, {
        text: '5北京',
        value: 5
    }, {
        text: '6海南',
        value: 6
    }];

    value: Array<PickerCell> = [{
        text: '四川',
        value: 3
    }, {
        text: '成都',
        value: 30
    }, {
        text: '双流区',
        value: 301
    }];

    ngOnInit() {
        console.log('page2');
    }

    show(a: any) {
        console.log(a);
    }
}