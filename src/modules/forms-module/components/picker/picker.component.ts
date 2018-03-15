import { Component, HostBinding, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface PickerCell {
    value: string | number;
    text: string | number;
    disabled?: boolean;
    readonly?: boolean;
    children?: Array<PickerCell>;
}

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
    forId: string = '';
    @Input()
    value: Array<PickerCell> = [];

    @Input()
    set data(list: Array<PickerCell>) {
        this.list = this.makeList(list);
    }

    @Input()
    name: string = '';
    @Output()
    change = new EventEmitter<Array<PickerCell>>();

    list: Array<Array<PickerCell>> = [];
    distanceList: Array<number> = [];

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

    updateDistance(event: any, index: number) {
        this.distanceList[index] = event.srcElement.scrollTop;
    }

    cellChange(cell: PickerCell, index: number) {
        this.value[index] = cell;
    }

    hide() {
        this.focus = false;
    }

    selected() {
        const indexes: Array<number> = [];
        const values: Array<PickerCell> = [];
        this.distanceList.forEach(item => {
            if (item % 30 > 0.5) {
                indexes.push(Math.ceil(item / 30));
            } else {
                indexes.push(Math.floor(item / 30));
            }
        });

        indexes.forEach((index, i) => {
            values.push(this.list[i][index]);
        });
        this.focus = false;
        this.change.emit(values);
    }

    writeValue(value: Array<PickerCell>) {
        this.value = value;
        value.forEach((item, index) => {
            const cells = this.list[index];
            if (cells) {
                cells.forEach((cell, i) => {
                    if (item.value === cell.value) {
                        this.distanceList[index] = i * 30;
                    }
                });
            }
        });
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

    private makeList(list: Array<PickerCell>): Array<Array<PickerCell>> {
        let result: Array<Array<PickerCell>> = [];

        const fn = (list: Array<PickerCell>, child: Array<PickerCell>) => {
            this.distanceList.push(0);
            result.push(child);
            list.forEach((item, index) => {
                if (index === 0 && item.children) {
                    const nextChild: Array<PickerCell> = [];
                    fn(item.children, nextChild);
                }
                child.push(item);
            });
        };

        fn(list, []);
        return result;
    }
}