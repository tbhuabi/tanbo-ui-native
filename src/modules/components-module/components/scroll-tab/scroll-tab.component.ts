import {
    Component,
    Input,
    EventEmitter,
    Output,
    ContentChildren,
    QueryList,
    ViewChild,
    AfterContentInit,
    OnDestroy,
    ElementRef
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Easing } from '@tweenjs/tween.js';

import { ScrollTabService } from './scroll-tab.service';
import { ScrollTabButtonComponent } from '../scroll-tab-button/scroll-tab-button.component';

@Component({
    selector: 'ui-scroll-tab',
    templateUrl: './scroll-tab.component.html',
    providers: [
        ScrollTabService
    ]
})
export class ScrollTabComponent implements AfterContentInit, OnDestroy {
    @Input()
    set index(value: number) {
        if (this.children) {
            this.autoUpdateStyle(value);
        }
        this._index = value;
    }

    get index() {
        return this._index;
    }

    @Output()
    change = new EventEmitter<number>();

    @ContentChildren(ScrollTabButtonComponent)
    children: QueryList<ScrollTabButtonComponent>;
    @ViewChild('wrap')
    wrap: ElementRef;

    left: number = 0;
    lineWidth: number = 0;

    private _index: number = 0;
    private subs: Subscription[] = [];

    private animationId: number;

    constructor(private scrollTabService: ScrollTabService) {
    }

    ngAfterContentInit() {
        setTimeout(() => {
            this.initStyle();
        });
        this.subs.push(this.children.changes.delay(0).subscribe(() => {
            this.initStyle();
        }));
        this.subs.push(this.scrollTabService.onSelected.subscribe(c => {
            this.children.forEach((item: ScrollTabButtonComponent, i: number) => {
                if (item === c) {
                    // this.autoUpdateStyle(i);
                    // this._index = i;
                    this.change.emit(i);
                }
            });
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(item => item.unsubscribe());
    }

    initStyle() {
        if (this.children.length === 0) {
            return;
        }
        const btns = this.children.toArray().map((item, index) => {
            item.selected = index === this.index;
            return item.elementRef.nativeElement;
        });

        const element = this.wrap.nativeElement;

        this.lineWidth = btns[this.index].offsetWidth;
        this.left = btns[this.index].offsetLeft;
        element.scrollLeft = this.left + this.lineWidth / 2 - element.offsetWidth / 2;
    }

    autoUpdateStyle(index: number) {
        cancelAnimationFrame(this.animationId);
        if (index === this.index) {
            return;
        }

        const btns = this.children.toArray().map((item, i) => {
            item.selected = i === index;
            return item.elementRef.nativeElement;
        });

        if (!btns[this.index] || !btns[index]) {
            return;
        }

        const element = this.wrap.nativeElement;
        const oldLineWidth = btns[this.index].offsetWidth;
        const oldScrollLeft = element.scrollLeft;
        const oldLeft = this.left;
        const targetLineWidth = btns[index].offsetWidth;
        const targetScrollLeft = btns[index].offsetLeft + btns[index].offsetWidth / 2 - element.offsetWidth / 2;
        const targetLeft = btns[index].offsetLeft;

        let i = 0;

        const fn = () => {
            i++;
            const offset = Easing.Cubic.Out(i / 20);
            const scrollLeft = offset * (targetScrollLeft - oldScrollLeft);
            const width = offset * (targetLineWidth - oldLineWidth);
            const left = offset * (targetLeft - oldLeft);
            element.scrollLeft = oldScrollLeft + scrollLeft;
            this.lineWidth = oldLineWidth + width;
            this.left = oldLeft + left;
            if (i < 20) {
                this.animationId = requestAnimationFrame(fn);
            }
        };

        this.animationId = requestAnimationFrame(fn);
    }
}