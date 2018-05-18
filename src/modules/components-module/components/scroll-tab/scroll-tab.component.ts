import {
    Component,
    Input,
    EventEmitter,
    Output,
    ContentChildren,
    QueryList,
    ViewChild,
    AfterViewInit,
    ChangeDetectorRef,
    OnDestroy,
    ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';

import { ScrollTabService } from './scroll-tab.service';
import { ScrollTabButtonComponent } from '../scroll-tab-button/scroll-tab-button.component';

@Component({
    selector: 'ui-scroll-tab',
    templateUrl: './scroll-tab.component.html',
    providers: [
        ScrollTabService
    ]
})
export class ScrollTabComponent implements AfterViewInit, OnDestroy {
    @Input()
    set index(value: number) {
        this._index = value;
        if (this.children) {
            this.updateTabAndLineStyle(value);
        }
    }

    get index() {
        return this._index;
    }

    @Input()
    vertical: boolean = false;

    @Output()
    change = new EventEmitter<number>();

    @ContentChildren(ScrollTabButtonComponent)
    children: QueryList<ScrollTabButtonComponent>;
    @ViewChild('wrap')
    wrap: ElementRef;

    left: number = 0;
    lineWidth: number = 0;

    scrollLeft: number = 0;

    private targetIndex: number;
    private openUpdateScroll: boolean = true;
    private containerWidth: number;
    private _index: number = 0;
    private sub: Subscription;

    constructor(private changeDetectorRef: ChangeDetectorRef,
                private elementRef: ElementRef,
                private scrollTabService: ScrollTabService) {
    }

    ngAfterViewInit() {
        this.updateTabAndLineStyle(this.index);
        this.containerWidth = this.elementRef.nativeElement.offsetWidth;
        this.sub = this.scrollTabService.onSelected.subscribe(c => {
            this.children.forEach((item: ScrollTabButtonComponent, i: number) => {
                if (item === c) {
                    this.openUpdateScroll = false;
                    this.targetIndex = i;
                    this.change.emit(i);
                }
            });
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    updateTabAndLineStyle(progress: number) {
        if (progress < 0) {
            progress = 0;
        } else if (progress > this.children.length - 1) {
            progress = this.children.length - 1;
        }
        const btns = this.children.toArray().map(item => {
            return item.elementRef.nativeElement;
        });
        const index: number = Math.floor(progress);
        const proportion: number = progress % 1;
        const current = btns[index];
        const prevWidth = current.offsetWidth;
        const next = btns[index + 1];
        this.left = current.offsetLeft + prevWidth * proportion;
        if (next) {
            this.lineWidth = prevWidth + (next.offsetWidth - prevWidth) * proportion;
        } else {
            this.lineWidth = prevWidth;
        }

        if (this.index === this.targetIndex) {
            this.openUpdateScroll = true;
        }

        if (this.openUpdateScroll) {
            if (this.left < this.scrollLeft) {
                this.scrollLeft = this.left;
            } else if (this.left + this.lineWidth - this.containerWidth > this.scrollLeft) {
                this.scrollLeft = this.left + this.lineWidth - this.containerWidth;
            }
        }

        this.changeDetectorRef.detectChanges();
    }

    scroll() {
        this.scrollLeft = this.wrap.nativeElement.scrollLeft;
    }
}