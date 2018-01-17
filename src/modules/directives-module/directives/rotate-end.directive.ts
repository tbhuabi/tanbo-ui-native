import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiRotateEnd]'
})
export class RotateEndDirective implements OnInit, OnDestroy {
    @Output()
    uiRotateEnd = new EventEmitter<any>();

    @Input()
    uiRotateEndOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiRotateEndOptions);
        this.hammerInstance.on('rotateend', (event: any) => {
            this.uiRotateEnd.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('rotateend');
    }
}