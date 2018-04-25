import { Component, OnInit, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

import { PickerService } from '../picker/picker.service';
import { PickerCell } from '../picker-column/picker-column.component';
import { timeAnalysisByTimeString, dateStringFormat, TimeDetails } from './date-utils';

@Component({
    selector: 'ui-input[type=date]',
    templateUrl: './date.component.html',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: DateComponent,
        multi: true
    }, PickerService]
})
export class DateComponent implements ControlValueAccessor, OnInit {
    @Input()
    name: string;
    @Input()
    text: string = '';
    @Input()
    value: string;
    @Input()
    forId: string;
    @Input()
    maxDate: string = '';
    @Input()
    minDate: string = '';
    @Input()
    format: string = 'yyyy-MM-dd';
    @Input()
    placeholder: string = '';

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

    @Output()
    change = new EventEmitter<boolean>();

    focus: boolean = false;
    dateList: Array<Array<PickerCell>> = [];
    values: Array<PickerCell> = [];

    private _disabled: boolean;
    private _readonly: boolean;

    private _maxDate: TimeDetails;
    private _minDate: TimeDetails;

    private onChange: (_: any) => any;
    private onTouched: (_: any) => any;
    private timer: any = null;
    private currentDate = new Date();

    static createList(min: number, max: number, unit: string) {
        const arr: Array<PickerCell> = [];
        for (let i = min; i < max; i++) {
            arr.push({
                text: i + unit,
                value: i
            });
        }
        return arr;
    }

    constructor(private pickerService: PickerService) {
    }

    ngOnInit() {
        let currentDate: Date;
        if (this.maxDate) {
            this._maxDate = timeAnalysisByTimeString(this.maxDate);
        } else {
            currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear() + 20);
            this._maxDate = timeAnalysisByTimeString(currentDate);
        }
        if (this.minDate) {
            this._minDate = timeAnalysisByTimeString(this.minDate);
        } else {
            currentDate = new Date();
            currentDate.setFullYear(currentDate.getFullYear() - 80);
            this._minDate = timeAnalysisByTimeString(currentDate);
        }

        this.format.replace(/[yMdhms]+/g, (str: string): string => {
            switch (str) {
                case 'yy':
                case 'yyyy':
                    this.initYears();
                    break;
                case 'M':
                case 'MM':
                    this.initMonths();
                    break;
                case 'd':
                case 'dd':
                    this.initDays();
                    break;
                case 'h':
                case 'hh':
                case 'm':
                case 'mm':
                case 's':
                case 'ss':
                default:
                    return str;
            }
            return str;
        });

        this.initYears();
        this.initMonths();
        this.initDays();
    }


    initYears() {
        this.dateList.push(DateComponent.createList(this._minDate.year, this._maxDate.year + 1, '年'));
    }

    initMonths() {
        this.dateList.push(DateComponent.createList(1, 13, '月'));
    }

    initDays() {
        const days: Array<PickerCell> = [];
        for (let i = 1; i < 31; i++) {
            days.push({
                text: i + '日',
                value: i
            });
        }

        this.dateList.push(days);
    }

    initHours() {
        const hours: Array<PickerCell> = [];
        for (let i = 1; i < 24; i++) {
            hours.push({
                text: i + '时',
                value: i
            });
        }

        this.dateList.push(hours);
    }

    @HostListener('click')
    click() {
        clearTimeout(this.timer);
        if (this.disabled || this.readonly) {
            return;
        }

        this.focus = true;
        this.timer = setTimeout(() => {
            this.pickerService.show();
        });
    }

    selected() {
        if (!this.focus) {
            return;
        }
        // if (this.onChange) {
        //     this.onChange(this._value);
        // }
        // if (this.onTouched) {
        //     this.onTouched(this._value);
        // }
        // this.value = this._value;
        // this.change.emit(this._value);
        this.hide();
    }

    cellSelected(cell: PickerCell, index: number) {
        this.values[index] = cell;
    }

    hide() {
        clearTimeout(this.timer);
        this.focus = false;
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