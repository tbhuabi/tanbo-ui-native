import {
    Component,
    ElementRef,
    EventEmitter,
    HostBinding,
    HostListener,
    Input,
    OnDestroy,
    OnInit,
    Output,
    ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { RadioStateService } from './radio-state.service';

@Component({
    selector: 'ui-input[type=radio]',
    templateUrl: './radio.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: RadioComponent,
        multi: true
    }]
})
export class RadioComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @Input()
    name: string;
    @Input()
    value: string;
    @Input()
    forId: string;

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
    @HostBinding('class.checked')
    set checked(isChecked: any) {
        this._checked = isChecked;
    }

    get checked() {
        let isChecked = (this as any).hasOwnProperty('_checked');
        return isChecked && this._checked !== false;
    }

    @Input()
    checkedIcon: string = 'ui-icon-radio-checked';
    @Input()
    uncheckedIcon: string = 'ui-icon-radio-unchecked';

    @Output()
    change = new EventEmitter<string>();

    @ViewChild('rawInput')
    rawInput: ElementRef;
    sub: Subscription;

    private _disabled: boolean;
    private _readonly: boolean;
    private _checked: boolean;

    private onChange: (_: any) => any;
    private onTouched: (_: any) => any;

    constructor(private radioStateService: RadioStateService) {
    }

    @HostListener('click')
    click() {
        if (this.disabled || this.readonly) {
            return;
        }
        this.rawInput.nativeElement.checked = true;
        if (this.onChange) {
            this.onChange(this.value);
        }
        if (this.onTouched) {
            this.onTouched(this.value);
        }
        // 当自身被点击时，发布事件，更新其它radio状态
        this.radioStateService.publishEvent();
        this.change.emit(this.value);
    }

    ngOnInit() {
        // 当某一个radio被点击时，更新其它radio状态
        this.sub = this.radioStateService.state$.subscribe(() => {
            this.checked = this.rawInput.nativeElement.checked;
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    writeValue(value: any) {
        if (typeof value === 'number') {
            this.checked = this.value === ('' + value);
        } else {
            this.checked = this.value === value;
        }
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