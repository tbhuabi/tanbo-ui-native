import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPanUp]'
})
export class PanUpDirective implements OnInit, OnDestroy {
    @Output()
    uiPanUp = new EventEmitter<any>();

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.on('panup', (event: any) => {
            this.uiPanUp.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('panup');
    }
}