import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPan]'
})
export class PanDirective implements OnInit, OnDestroy {
    @Output()
    uiPan = new EventEmitter<any>();

    @Input()
    uiPanOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPanOptions);
        this.hammerInstance.on('pan', (event: any) => {
            this.uiPan.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pan');
    }
}