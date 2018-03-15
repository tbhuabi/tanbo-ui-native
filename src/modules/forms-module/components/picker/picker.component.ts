import { Component, HostBinding, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PickerCell } from '../picker-column/picker-column.component';

@Component({
    selector: 'ui-picker',
    templateUrl: './picker.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: PickerComponent,
        multi: true
    }]
})
export class PickerComponent implements ControlValueAccessor {
    @HostBinding('class.focus')
    focus: boolean = false;

    @Input()
    set disabled(isDisabled: any) {
        this._disabled = isDisabled;
    }

    get disabled() {
        let isDisabled = (this as any).hasOwnProperty('_disabled');
        return isDisabled && this._disabled !== false;
    }

    @Input()
    set readonly(isReadonly: any) {
        this._readonly = isReadonly;
    }

    get readonly() {
        let isReadonly = (this as any).hasOwnProperty('_readonly');
        return isReadonly && this._readonly !== false;
    }

    @Input()
    columnSize: number = 3;
    @Input()
    forId: string = '';
    @Input()
    value: Array<PickerCell> = [];

    @Input()
    set data(list: Array<PickerCell>) {
        this.makeList(0, list);
    }

    @Input()
    name: string = '';
    @Output()
    change = new EventEmitter<Array<PickerCell>>();

    list: Array<Array<PickerCell>> = [];

    private onChange: (_: any) => void;
    private onTouched: (_: any) => void;
    private _disabled: boolean;
    private _readonly: boolean;

    @HostListener('click')
    click() {
        if (this.disabled || this.readonly) {
            return;
        }

        this.focus = true;
    }

    hide() {
        this.focus = false;
    }

    cellSelected(cell: PickerCell, index: number) {
        this.value[index] = cell;
        this.value.length = index + 1;
        let children = cell.children;
        let i = index;
        while (children) {
            this.value[++i] = children[0];
            children = children[0].children;
        }
        this.makeList(index + 1, cell.children);
    }

    selected() {
        if (this.onChange) {
            this.onChange(this.value);
        }
        if (this.onTouched) {
            this.onTouched(this.value);
        }
        this.change.emit(this.value);
        this.hide();
    }

    writeValue(value: Array<PickerCell>) {
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

    private makeList(startIndex: number, list?: Array<PickerCell>) {
        this.list.length = startIndex;
        if (list) {
            const fn = (list: Array<PickerCell>, child: Array<PickerCell>, index: number) => {
                this.list.push(child);
                list.forEach(item => {
                    if (item.value === this.value[index].value && item.children) {
                        const nextChild: Array<PickerCell> = [];
                        fn(item.children, nextChild, index + 1);
                    }
                    child.push(item);
                });
            };

            fn(list, [], startIndex);
        }

        this.completionListLength();
    }

    private completionListLength() {
        for (let i = this.list.length; i < this.columnSize; i++) {
            this.list.push([]);
        }
    }
}