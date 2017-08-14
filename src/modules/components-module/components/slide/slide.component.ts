import { Component, ContentChildren, QueryList, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { SlideItemComponent } from '../slide-item/slide-item.component';

@Component({
    selector: 'ui-slide',
    templateUrl: './slide.component.html'
})
export class SlideComponent implements AfterViewInit, OnDestroy {
    @ContentChildren(SlideItemComponent)
    items: QueryList<SlideItemComponent>;
    @Input()
    initIndex: number = 0;
    @Input()
    speed: number = 2000;

    private timer: any = null;

    ngAfterViewInit() {
        this.items.forEach((item: SlideItemComponent, index: number) => {
            setTimeout(() => {
                if (index === this.initIndex) {
                    item.active = true;
                    this.play();
                } else {
                    item.active = false;
                }
            });
        });
    }

    play() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => {
            this.initIndex++;
            this.initIndex %= this.items.length;
            this.ngAfterViewInit();
        }, this.speed);
    }

    ngOnDestroy() {
        clearTimeout(this.timer);
    }
}