import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPanLeft]'
})
export class PanLeftDirective implements OnInit, OnDestroy {
    @Output()
    uiPanLeft = new EventEmitter<any>();

    @Input()
    uiPanLeftOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPanLeftOptions);
        this.hammerInstance.on('panleft', (event: any) => {
            this.uiPanLeft.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('panleft');
    }
}