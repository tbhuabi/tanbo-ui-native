import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiSwipeDown]'
})
export class SwipeDownDirective implements OnInit, OnDestroy {
    @Output()
    uiSwipeDown = new EventEmitter<any>();

    @Input()
    uiSwipeDownOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiSwipeDownOptions);
        this.hammerInstance.on('swipedown', (event: any) => {
            this.uiSwipeDown.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('swipedown');
    }
}