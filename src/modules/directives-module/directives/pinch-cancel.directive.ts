import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPinchCancel]'
})
export class PinchCancelDirective implements OnInit, OnDestroy {
    @Output()
    uiPinchCancel = new EventEmitter<any>();

    @Input()
    uiPinchCancelOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPinchCancelOptions);
        this.hammerInstance.on('pinchcancel', (event: any) => {
            this.uiPinchCancel.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pinchcancel');
    }
}