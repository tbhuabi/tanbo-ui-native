import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiSwipe]'
})
export class SwipeDirective implements OnInit, OnDestroy {
    @Output()
    uiSwipe = new EventEmitter<any>();

    @Input()
    uiSwipeOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiSwipeOptions);
        this.hammerInstance.on('swipe', (event: any) => {
            this.uiSwipe.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('swipe');
    }
}