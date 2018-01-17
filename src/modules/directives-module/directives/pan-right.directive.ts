import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPanRight]'
})
export class PanRightDirective implements OnInit, OnDestroy {
    @Output()
    uiPanRight = new EventEmitter<any>();

    @Input()
    uiPanRightOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPanRightOptions);
        this.hammerInstance.on('panright', (event: any) => {
            this.uiPanRight.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('panright');
    }
}