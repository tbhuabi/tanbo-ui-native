import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPinchEnd]'
})
export class PinchEndDirective implements OnInit, OnDestroy {
    @Output()
    uiPinchEnd = new EventEmitter<any>();

    @Input()
    uiPinchEndOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPinchEndOptions);
        this.hammerInstance.on('pinchend', (event: any) => {
            this.uiPinchEnd.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pinchend');
    }
}