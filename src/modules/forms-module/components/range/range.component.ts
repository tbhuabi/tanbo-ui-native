import { Component, ElementRef, EventEmitter, HostBinding, Input, Output, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'ui-input[type=range]',
    templateUrl: './range.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: RangeComponent,
        multi: true
    }]
})
export class RangeComponent implements ControlValueAccessor {
    @Input()
    name: string;
    @Input()
    forId: string;

    @Input()
    showProgress: boolean = false;

    @ViewChild('rangeBar')
    rangeBar: ElementRef;

    @Input()
    @HostBinding('class.disabled')
    set disabled(isDisabled: any) {
        this._disabled = isDisabled;
    }

    get disabled() {
        let isDisabled = (this as any).hasOwnProperty('_disabled');
        return isDisabled && this._disabled !== false;
    }

    @Input()
    @HostBinding('class.readonly')
    set readonly(isReadonly: any) {
        this._readonly = isReadonly;
    }

    get readonly() {
        let isReadonly = (this as any).hasOwnProperty('_readonly');
        return isReadonly && this._readonly !== false;
    }

    @Input()
    set min(min: any) {
        let v = RangeComponent.toNumber(min);
        if (!isNaN(v)) {
            this._min = v;
        }
    }

    get min() {
        return this._min;
    }

    @Input()
    set max(max: any) {
        let v = RangeComponent.toNumber(max);
        if (!isNaN(v)) {
            this._max = v;
        }
    }

    get max() {
        return this._max;
    }

    @Input()
    set step(step: any) {
        let v = RangeComponent.toNumber(step);
        if (!isNaN(v)) {
            this._step = v;
        }
    }

    get step() {
        return this._step;
    }

    @Input()
    set value(value: any) {
        let v = RangeComponent.toNumber(value);
        if (!isNaN(v)) {
            this._value = v;
            if (this.min <= this.max) {
                if (v < this.min) {
                    v = this.min;
                } else if (v > this.max) {
                    v = this.max;
                }
                this.position = (v - this.min) / (this.max - this.min) * 100;
            }
        }
    }

    get value() {
        return this._value;
    }

    position: number = 50;
    isTouching: boolean = false;

    @Output()
    change = new EventEmitter<string>();

    private _disabled: boolean;
    private _readonly: boolean;
    private _min: number = 0;
    private _max: number = 100;
    private _step: number = 1;
    private _value: number = 50;

    private onChange: (_: any) => any;
    private onTouched: (_: any) => any;

    static toNumber(value: any): number {
        if (typeof value === 'number') {
            return value;
        }
        return Number(value);
    }

    constructor(private elementRef: ElementRef,
                private renderer: Renderer2) {

    }

    drag(event: any) {
        if (this.readonly || this.disabled) {
            return;
        }
        this.isTouching = true;
        let unbindTouchEndFn: () => void;
        let unbindTouchCancelFn: () => void;
        let unbindTouchMoveFn: () => void;

        unbindTouchEndFn = this.renderer.listen('document', 'touchend', () => {
            this.isTouching = false;
            unbindTouchMoveFn();
            unbindTouchEndFn();
            unbindTouchCancelFn();
        });
        unbindTouchCancelFn = this.renderer.listen('document', 'touchcancel', () => {
            this.isTouching = false;
            unbindTouchMoveFn();
            unbindTouchEndFn();
            unbindTouchCancelFn();
        });
        if (this.min >= this.max) {
            return;
        }
        let section = this.max - this.min;
        let maxWidth = this.elementRef.nativeElement.offsetWidth;
        let nowWidth = this.rangeBar.nativeElement.offsetWidth;

        let oldX: number = event.touches[0].clientX;

        unbindTouchMoveFn = this.renderer.listen('document', 'touchmove', (ev: any) => {
            let dragDistance: number = ev.touches[0].clientX - oldX;
            let proportion = (nowWidth + dragDistance) / maxWidth;
            let temporaryValue = Math.floor(section * proportion / this.step) * this.step;

            let value = this.min + temporaryValue;
            if (value < this.min) {
                value = this.min;
            } else if (value > this.max) {
                value = this.max - (this.max - this.min) % this.step;
            }

            this.value = value;
            if (this.onChange) {
                this.onChange(value);
            }
            if (this.onTouched) {
                this.onTouched(value);
            }
            this.change.emit(value);
        });

    }

    writeValue(value: any) {
        this.value = value;
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }
}