import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPanRight]'
})
export class PanRightDirective implements OnInit, OnDestroy {
    @Output()
    uiPanRight = new EventEmitter<any>();

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.on('panright', (event: any) => {
            this.uiPanRight.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('panright');
    }
}