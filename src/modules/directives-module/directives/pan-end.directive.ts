import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPanEnd]'
})
export class PanEndDirective implements OnInit, OnDestroy {
    @Output()
    uiPanEnd = new EventEmitter<any>();

    @Input()
    uiPanEndOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPanEndOptions);
        this.hammerInstance.on('panend', (event: any) => {
            this.uiPanEnd.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('panend');
    }
}