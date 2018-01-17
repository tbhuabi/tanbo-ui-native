import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPanCancel]'
})
export class PanCancelDirective implements OnInit, OnDestroy {
    @Output()
    uiPanCancel = new EventEmitter<any>();

    @Input()
    uiPanCancelOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPanCancelOptions);
        this.hammerInstance.on('pancancel', (event: any) => {
            this.uiPanCancel.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pancancel');
    }
}