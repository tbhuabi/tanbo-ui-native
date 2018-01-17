import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPinchIn]'
})
export class PinchInDirective implements OnInit, OnDestroy {
    @Output()
    uiPinchIn = new EventEmitter<any>();

    @Input()
    uiPinchInOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPinchInOptions);
        this.hammerInstance.on('pinchin', (event: any) => {
            this.uiPinchIn.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pinchin');
    }
}