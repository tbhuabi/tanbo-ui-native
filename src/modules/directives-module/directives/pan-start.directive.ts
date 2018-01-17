import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPanStart]'
})
export class PanStartDirective implements OnInit, OnDestroy {
    @Output()
    uiPanStart = new EventEmitter<any>();

    @Input()
    uiPanStartOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPanStartOptions);
        this.hammerInstance.on('panstart', (event: any) => {
            this.uiPanStart.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('panstart');
    }
}