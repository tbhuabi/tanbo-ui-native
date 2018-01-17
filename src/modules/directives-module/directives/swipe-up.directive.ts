import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiSwipeUp]'
})
export class SwipeUpDirective implements OnInit, OnDestroy {
    @Output()
    uiSwipeUp = new EventEmitter<any>();

    @Input()
    uiSwipeUpOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiSwipeUpOptions);
        this.hammerInstance.on('swipeup', (event: any) => {
            this.uiSwipeUp.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('swipeup');
    }
}