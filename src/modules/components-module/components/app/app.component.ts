import { AfterViewInit, Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';

import { NavController } from '../views/navigation-controller';
import { ListActivatedService } from '../list-item/list-activated.service';

@Component({
    selector: 'ui-app',
    templateUrl: './app.component.html',
    providers: [
        NavController
    ]
})
export class AppComponent implements OnInit, AfterViewInit {
    @Input()
    rootPage: any;
    @Input()
    baseFontSize: number = 10;

    private htmlElement: HTMLElement;
    private defaultDocWidth: number = 320;

    constructor(@Inject(DOCUMENT) private document: Document,
                private listActivatedService: ListActivatedService,
                private navController: NavController) {
    }

    ngOnInit() {
        this.htmlElement = this.document.querySelector('html');
        this.resize();
    }

    ngAfterViewInit() {
        if (this.rootPage) {
            this.navController.push(this.rootPage);
        }
    }

    @HostListener('window:resize')
    resize() {
        if (!this.htmlElement) {
            return;
        }
        let docWidth = this.htmlElement.getBoundingClientRect().width;
        let scale = docWidth / this.defaultDocWidth;
        this.htmlElement.style.fontSize = `${scale * this.baseFontSize}px`;
    }

    @HostListener('document:touchstart')
    documentTouchStart() {
        this.listActivatedService.publish();
    }
}