import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPinchOut]'
})
export class PinchOutDirective implements OnInit, OnDestroy {
    @Output()
    uiPinchOut = new EventEmitter<any>();

    @Input()
    uiPinchOutOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPinchOutOptions);
        this.hammerInstance.on('pinchout', (event: any) => {
            this.uiPinchOut.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pinchout');
    }
}