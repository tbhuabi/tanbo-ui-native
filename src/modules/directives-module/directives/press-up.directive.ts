import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPressUp]'
})
export class PressUpDirective implements OnInit, OnDestroy {
    @Output()
    uiPressUp = new EventEmitter<any>();

    @Input()
    uiPressUpOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPressUpOptions);
        this.hammerInstance.on('pressup', (event: any) => {
            this.uiPressUp.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('pressup');
    }
}