import { Directive, ElementRef, Renderer2, OnDestroy, Input, OnInit } from '@angular/core';
@Directive({
    selector: '[uiStopPropagation]'
})
export class StopPropagationDirective implements OnInit, OnDestroy {
    @Input()
    uiStopPropagation: Array<string> | string;

    private callbacks: Array<any> = [];

    constructor(private elementRef: ElementRef, private renderer: Renderer2) {
    }

    ngOnInit() {
        if (typeof this.uiStopPropagation === 'string') {
            this.addEvent(this.uiStopPropagation || 'click');
        } else {
            this.uiStopPropagation.forEach(eventType => {
                this.addEvent(eventType);
            });
        }
    }

    ngOnDestroy() {
        this.callbacks.forEach(fn => {
            fn();
        });
    }

    private addEvent(eventType: string) {
        let fn = this.renderer.listen(this.elementRef.nativeElement, eventType, (ev: any) => {
            ev.stopPropagation();
        });
        this.callbacks.push(fn);
    }
}
