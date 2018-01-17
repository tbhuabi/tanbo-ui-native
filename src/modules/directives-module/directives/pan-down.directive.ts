import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPanDown]'
})
export class PanDownDirective implements OnInit, OnDestroy {
    @Output()
    uiPanDown = new EventEmitter<any>();

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.on('pandown', (event: any) => {
            this.uiPanDown.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pandown');
    }
}