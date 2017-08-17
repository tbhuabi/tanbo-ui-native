import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPan]'
})
export class PanDirective implements OnInit, OnDestroy {
    @Output()
    uiPan = new EventEmitter<any>();

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.on('pan', (event: any) => {
            this.uiPan.emit(event);
        })
    }

    ngOnDestroy() {
        this.hammerInstance.off('pan');
    }
}