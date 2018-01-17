import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPanStart]'
})
export class PanStartDirective implements OnInit, OnDestroy {
    @Output()
    uiPanStart = new EventEmitter<any>();

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.on('panstart', (event: any) => {
            this.uiPanStart.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('panstart');
    }
}