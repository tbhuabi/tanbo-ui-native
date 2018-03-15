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
        text: '四川',
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
        text: '河南',
        value: 4
    }, {
        text: '北京',
        value: 5
    }, {
        text: '海南',
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