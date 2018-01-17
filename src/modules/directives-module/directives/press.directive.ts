import { Directive, ElementRef, EventEmitter, OnDestroy, OnInit, Output, Input } from '@angular/core';
import 'hammerjs';

@Directive({
    selector: '[uiPress]'
})
export class PressDirective implements OnInit, OnDestroy {
    @Output()
    uiPress = new EventEmitter<any>();

    @Input()
    uiPressOptions: HammerOptions = {};

    private hammerInstance: HammerManager;

    constructor(private elementRef: ElementRef) {
    }

    ngOnInit() {
        let element = this.elementRef.nativeElement;
        this.hammerInstance = new Hammer(element);
        this.hammerInstance.set(this.uiPressOptions);
        this.hammerInstance.on('press', (event: any) => {
            this.uiPress.emit(event);
        });
    }

    ngOnDestroy() {
        this.hammerInstance.off('press');
    }
}