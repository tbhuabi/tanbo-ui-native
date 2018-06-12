import { Component, Input, Optional, OnInit, OnDestroy, AfterViewInit, ElementRef, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';

import { ScrollService } from '../scroll/scroll.service';

@Component({
    selector: 'ui-fixed-bar',
    templateUrl: './fixed-bar.component.html'
})
export class FixedBarComponent implements OnInit, OnDestroy, AfterViewInit {
    @Input()
    offset: number = 0;
    @HostBinding('class.ui-fixed')
    fixed: boolean = false;
    private offsetTop: number = 0;
    private sub: Subscription;

    constructor(@Optional() private scrollService: ScrollService,
                private elementRef: ElementRef) {
    }

    ngOnInit() {
        if (this.scrollService) {
            this.sub = this.scrollService.onScroll.subscribe((scrollTop: number) => {
                this.fixed = this.offsetTop < scrollTop + this.offset;
            });
        }
    }

    ngAfterViewInit() {
        this.offsetTop = this.elementRef.nativeElement.offsetTop;
    }

    ngOnDestroy() {
        if (this.sub) {
            this.sub.unsubscribe();
        }
    }
}