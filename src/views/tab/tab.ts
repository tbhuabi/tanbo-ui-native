import { Component, OnInit } from '@angular/core';

import { ChildComponent } from './tab1/child/child';
import { Child3Component } from './tab2/child/child';
import { PageTransferStationService, ViewConfig } from '../../services/page-transfer-station';
import { NavController, OnViewEnter, OnViewLeave, AnimationType } from '../../modules/index';

@Component({
    templateUrl: './tab.html'
})
export class TabComponent implements OnInit, OnViewEnter, OnViewLeave {
    page = ChildComponent;
    page2 = Child3Component;

    constructor(private pageTransferStationService: PageTransferStationService,
                private nav: NavController) {
    }

    ngOnInit() {
        this.pageTransferStationService.component$.subscribe((params: ViewConfig) => {
            this.nav.push(params.component, null, {
                activate: AnimationType.SlideInDown,
                reactivate: AnimationType.SlideInUp,
                toStack: AnimationType.SlideOutDown,
                destroy: AnimationType.SlideOutUp
            });
        });
    }

    uiOnViewEnter() {
        console.log('22222');
    }

    uiOnViewLeave() {
        console.log('555555555555');
    }
}