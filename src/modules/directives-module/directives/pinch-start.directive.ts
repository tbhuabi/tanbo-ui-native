import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPinchStart]'
})
export class PinchStartDirective implements OnInit, OnDestroy {
    @Output()
    uiPinchStart = new EventEmitter<any>();

    @Input()
    uiPinchStartOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPinchStartOptions);
        this.hammerInstance.on('pinchstart', (event: any) => {
            this.uiPinchStart.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pinchstart');
    }
}