import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiRotateCancel]'
})
export class RotateCancelDirective implements OnInit, OnDestroy {
    @Output()
    uiRotateCancel = new EventEmitter<any>();

    @Input()
    uiRotateCancelOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiRotateCancelOptions);
        this.hammerInstance.on('rotatecancel', (event: any) => {
            this.uiRotateCancel.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('rotatecancel');
    }
}