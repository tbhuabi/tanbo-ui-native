import { Component, HostListener } from '@angular/core';

import { NavController } from '../navigation/navigation-controller.service';

@Component({
    selector: 'ui-back',
    templateUrl: './back.component.html'
})
export class BackComponent {

    constructor(private navController: NavController) {
    }

    @HostListener('click')
    click() {
        // 当用户点击组件时，触发视图返回上一页
        this.navController.pop();
    }
}