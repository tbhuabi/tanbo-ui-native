import { Component, OnInit, Input, Output, EventEmitter, HostBinding, OnDestroy } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

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
export class DateComponent implements ControlValueAccessor, OnInit, OnDestroy {
    @Input()
    name: string = '';
    @Input()
    value: string = '';
    @Input()
    forId: string = '';
    @Input()
    maxDate: string = '';
    @Input()
    minDate: string = '';
    @Input()
    format: string = 'yyyy-MM-dd';
    @Input()
    displayFormat: string = '';
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
    change = new EventEmitter<string>();

    focus: boolean = false;

    years: Array<PickerCell> = [];
    months: Array<PickerCell> = [];
    days: Array<PickerCell> = [];
    hours: Array<PickerCell> = [];
    minutes: Array<PickerCell> = [];
    seconds: Array<PickerCell> = [];

    currentDate: TimeDetails;

    displayValue: string = '';

    private _disabled: boolean;
    private _readonly: boolean;

    private _maxDate: TimeDetails;
    private _minDate: TimeDetails;

    private onChange: (_: any) => any;
    private onTouched: (_: any) => any;
    private timer: any = null;

    private sub: Subscription;
    private isScrolling: boolean = false;

    static createList(arr: Array<PickerCell>, min: number, max: number, unit: string) {
        arr.length = 0;
        for (let i = min; i <= max; i++) {
            arr.push({
                text: (unit === '月' ? i + 1 : i) + unit,
                value: i
            });
        }
        return arr;
    }

    constructor(private pickerService: PickerService) {
    }

    ngOnInit() {
        this.sub = this.pickerService.onScroll.subscribe(b => {
           this.isScrolling = b;
        });

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

        this.currentDate = timeAnalysisByTimeString(this.value || new Date());
        if (this.value) {
            this.displayValue = dateStringFormat(this.displayFormat || this.format, this.currentDate);
        }

        this.initYears();
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    initYears() {
        if (/yy|yyyy/.test(this.format)) {
            DateComponent.createList(this.years, this._minDate.year, this._maxDate.year, '年');
        }
        this.initMonths();
    }

    initMonths() {
        if (/M|MM/.test(this.format)) {
            DateComponent.createList(this.months, 0, 11, '月');
            // if (this.currentDate.year === this._maxDate.year) {
            //     months.forEach(item => {
            //         if (item.value > this._maxDate.month) {
            //             item.disabled = true;
            //         }
            //     });
            // } else if (this.currentDate.year === this._minDate.year) {
            //     months.forEach(item => {
            //         if (item.value < this._minDate.month) {
            //             item.disabled = true;
            //         }
            //     });
            // }
        }

        this.initDays();
    }

    initDays() {
        if (/d|dd/.test(this.format)) {
            const date = new Date();
            date.setFullYear(this.currentDate.year);
            date.setDate(1);
            date.setMonth(this.currentDate.month + 1);
            date.setDate(0);
            const maxDay = date.getDate();
            if (this.currentDate.day > maxDay) {
                this.currentDate.day = maxDay;
            }
            DateComponent.createList(this.days, 1, maxDay, '日');
            // if (this.currentDate.year === this._maxDate.year && this.currentDate.month === this._maxDate.month) {
            //     days.forEach(item => {
            //         if (item.value > this._maxDate.day) {
            //             item.disabled = true;
            //         }
            //     });
            // } else if (this.currentDate.year === this._minDate.year &&
            // this.currentDate.month === this._minDate.month) {
            //     days.forEach(item => {
            //         if (item.value < this._minDate.day) {
            //             item.disabled = true;
            //         }
            //     });
            // }
        }
    }

    show() {
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
        if (!this.focus || this.isScrolling) {
            return;
        }
        const value = dateStringFormat(this.format, this.currentDate);
        this.displayValue = dateStringFormat(this.displayFormat || this.format, this.currentDate);
        if (this.onChange) {
            this.onChange(value);
        }
        if (this.onTouched) {
            this.onTouched(value);
        }
        this.value = value;
        this.change.emit(value);
        this.hide();
    }

    cellSelected(cell: PickerCell, type: string) {
        switch (type) {
            case 'year':
                this.currentDate.year = +cell.value;
                this.initMonths();
                break;
            case 'month':
                this.currentDate.month = +cell.value;
                this.initDays();
                break;
            case 'day':
                this.currentDate.day = +cell.value;
                break;
            case 'hours':
                this.currentDate.hours = +cell.value;
                break;
            case 'minutes':
                this.currentDate.minutes = +cell.value;
                break;
            case 'seconds':
                this.currentDate.seconds = +cell.value;
                break;
        }
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