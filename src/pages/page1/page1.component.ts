import { Component, AfterViewInit, OnInit } from '@angular/core';
import { PullDownRefreshController, ContentLoadingController } from '../../modules/index';

@Component({
    templateUrl: './page1.component.html'
})
export class Page1Component implements AfterViewInit, OnInit {
    dataList: Array<any> = [{name: 'a'}, {name: 'b'}];
    constructor(private pullDownRefreshController: PullDownRefreshController,
                private contentLoadingController: ContentLoadingController) {
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        this.contentLoadingController.show('正在加载中');
        // this.pullDownRefreshController.refresh();
    }

    pan(event: any) {
        console.log(event.deltaX);
        // console.log(event.additionalEvent , event.distance);
    }

    loaded() {
        this.pullDownRefreshController.refreshEnd();
    }

    refresh() {
        this.pullDownRefreshController.refresh();
    }
}