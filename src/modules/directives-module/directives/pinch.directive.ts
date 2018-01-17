import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPinch]'
})
export class PinchDirective implements OnInit, OnDestroy {
    @Output()
    uiPinch = new EventEmitter<any>();

    @Input()
    uiPinchOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPinchOptions);
        this.hammerInstance.on('pinch', (event: any) => {
            this.uiPinch.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pinch');
    }
}