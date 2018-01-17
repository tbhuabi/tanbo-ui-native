import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiRotateStart]'
})
export class RotateStartDirective implements OnInit, OnDestroy {
    @Output()
    uiRotateStart = new EventEmitter<any>();

    @Input()
    uiRotateStartOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiRotateStartOptions);
        this.hammerInstance.on('rotatestart', (event: any) => {
            this.uiRotateStart.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('rotatestart');
    }
}