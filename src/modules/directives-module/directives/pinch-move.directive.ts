import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPinchMove]'
})
export class PinchMoveDirective implements OnInit, OnDestroy {
    @Output()
    uiPinchMove = new EventEmitter<any>();

    @Input()
    uiPinchMoveOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPinchMoveOptions);
        this.hammerInstance.on('pinchmove', (event: any) => {
            this.uiPinchMove.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pinchmove');
    }
}