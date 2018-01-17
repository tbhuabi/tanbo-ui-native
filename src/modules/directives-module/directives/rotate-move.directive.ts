import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiRotateMove]'
})
export class RotateMoveDirective implements OnInit, OnDestroy {
    @Output()
    uiRotateMove = new EventEmitter<any>();

    @Input()
    uiRotateMoveOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiRotateMoveOptions);
        this.hammerInstance.on('rotatemove', (event: any) => {
            this.uiRotateMove.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('rotatemove');
    }
}