import { Component, OnInit, Inject, HostListener, Input, AfterViewInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { NavController } from '../views/navigation-controller';

@Component({
    selector: 'ui-native-app',
    templateUrl: './app.component.html',
    providers: [
        NavController
    ]
})
export class AppComponent implements OnInit, AfterViewInit {
    @Input()
    rootPage: any;
    @Input()
    baseFontSize: number = 100;

    private htmlElement: HTMLElement;
    private defaultDocWidth: number = 320;

    constructor(@Inject(DOCUMENT) private document: Document,
                private navController: NavController) {
    }

    ngOnInit() {
        this.htmlElement = this.document.querySelector('html');
        this.resize();
    }

    ngAfterViewInit() {
        this.navController.push(this.rootPage);
    }

    @HostListener('window:resize') resize() {
        if (!this.htmlElement) {
            return;
        }
        let docWidth = this.htmlElement.getBoundingClientRect().width;
        let scale = docWidth / this.defaultDocWidth;
        this.htmlElement.style.fontSize = `${scale * this.baseFontSize}px`;
    }
}