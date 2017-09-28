import { Component, OnDestroy, OnInit } from '@angular/core';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { Subscription } from 'rxjs';
import { ContentLoadingController } from './content-loading.service';

@Component({
    selector: 'ui-content-loading',
    templateUrl: './content-loading.component.html',
    animations: [
        trigger('loadingAnimate', [transition(':enter', animate('0.15s', keyframes([
            style({
                opacity: 0,
                offset: 0
            }),
            style({
                opacity: 1,
                offset: 1
            })
        ]))), transition(':leave', animate('0.15s', keyframes([
            style({
                opacity: 1,
                offset: 0
            }),
            style({
                opacity: 0,
                offset: 1
            })
        ])))])
    ]
})
export class ContentLoadingComponent implements OnInit, OnDestroy {
    show: boolean = false;
    text: string = '';

    private subs: Array<Subscription> = [];

    constructor(private contentLoadingController: ContentLoadingController) {
    }

    ngOnInit() {
        this.subs.push(this.contentLoadingController.showLoading$.subscribe((text?: string) => {
            this.show = true;
            this.text = text;
        }));

        this.subs.push(this.contentLoadingController.hideLoading$.subscribe(() => {
            this.show = false;
            this.text = '';
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => {
            item.unsubscribe();
        });
    }
}