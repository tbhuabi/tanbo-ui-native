import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiTap]'
})
export class TapDirective implements OnInit, OnDestroy {
    @Output()
    uiTap = new EventEmitter<any>();

    @Input()
    uiTapOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiTapOptions);
        this.hammerInstance.on('tap', (event: any) => {
            this.uiTap.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('tap');
    }
}