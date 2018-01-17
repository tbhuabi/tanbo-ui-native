import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPanMove]'
})
export class PanMoveDirective implements OnInit, OnDestroy {
    @Output()
    uiPanMove = new EventEmitter<any>();

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.on('panmove', (event: any) => {
            this.uiPanMove.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('panmove');
    }
}