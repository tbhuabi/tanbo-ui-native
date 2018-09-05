import { Component, OnInit, Input, Output, EventEmitter, HostBinding, OnDestroy, Inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';

import { PickerService, PickerCell } from '../picker/picker.service';
import { UIDate } from './date-utils';
import { UI_SELECT_ARROW_CLASSNAME, inputAttrToBoolean } from '../helper';

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
  title: string = '';
  @Input()
  name: string;

  @Input()
  set value(value: string | number | Date) {
    this.currentDate = new UIDate(value);
    this._value = value;
    if (value === '' || value === null || value === undefined) {
      this.displayValue = '';
    } else {
      this.displayValue = this.currentDate.toStringByFormatString(this.displayFormat || this.format);
    }
  }

  get value() {
    return this._value;
  }

  @Input()
  forId: string;

  @Input()
  set maxDate(value: string | Date) {
    this._maxDate = new UIDate(value);
  }

  @Input()
  set minDate(value: string | Date) {
    this._minDate = new UIDate(value);
  }

  @Input()
  format: string = 'yyyy-MM-dd';
  @Input()
  displayFormat: string = '';
  @Input()
  placeholder: string = '';
  @Input()
  arrowIconClassName: string = '';

  @Input()
  @HostBinding('class.ui-disabled')
  set disabled(isDisabled: any) {
    this._disabled = inputAttrToBoolean(isDisabled);
  }

  get disabled() {
    return this._disabled;
  }

  @Input()
  @HostBinding('class.ui-readonly')
  set readonly(isReadonly: any) {
    this._readonly = inputAttrToBoolean(isReadonly);
  }

  get readonly() {
    return this._readonly;
  }

  @Output()
  uiChange = new EventEmitter<string | number>();

  focus: boolean = false;

  years: Array<PickerCell> = [];
  months: Array<PickerCell> = [];
  days: Array<PickerCell> = [];
  hours: Array<PickerCell> = [];
  minutes: Array<PickerCell> = [];
  seconds: Array<PickerCell> = [];

  currentDate: UIDate;

  displayValue: string = '';

  private _disabled: boolean = false;
  private _readonly: boolean = false;

  private _value: string | number | Date;
  private _maxDate: UIDate;
  private _minDate: UIDate;

  private onChange: (_: any) => any;
  private onTouched: (_: any) => any;
  private timer: any = null;

  private sub: Subscription;
  private isScrolling: boolean = false;

  constructor(@Inject(UI_SELECT_ARROW_CLASSNAME) arrowIcon: string,
              private pickerService: PickerService) {
    this.arrowIconClassName = arrowIcon;
  }

  ngOnInit() {
    this.sub = this.pickerService.onScroll.subscribe(b => {
      this.isScrolling = b;
    });
    if (!this.currentDate) {
      this.currentDate = new UIDate();
    }
    let d: Date;
    if (!this._maxDate) {
      d = new Date(this.currentDate.timestamp);
      d.setFullYear(d.getFullYear() + 20);
      this._maxDate = new UIDate(d);
    }
    if (!this._minDate) {
      d = new Date(this.currentDate.timestamp);
      d.setFullYear(d.getFullYear() - 80);
      this._minDate = new UIDate(d);
    }

    this.initYears();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  initYears() {
    if (/yy|yyyy/.test(this.format)) {
      this.years.length = 0;
      for (let i = this._minDate.year; i <= this._maxDate.year; i++) {
        this.years.push({
          value: i,
          text: i + '年'
        });
      }
    }
    this.initMonths();
  }

  initMonths() {
    if (/M|MM/.test(this.format)) {
      this.months.length = 0;
      let startMonth: number = 0;
      let endMonth = 11;
      if (this.currentDate.year <= this._minDate.year) {
        startMonth = this._minDate.month;
        if (this.currentDate.month < startMonth) {
          this.currentDate.month = startMonth;
        }
      }
      if (this.currentDate.year >= this._maxDate.year) {
        endMonth = this._maxDate.month;
        if (this.currentDate.month > endMonth) {
          this.currentDate.month = endMonth;
        }
      }
      for (; startMonth <= endMonth; startMonth++) {
        this.months.push({
          value: startMonth,
          text: startMonth + 1 + '月'
        });
      }
    }

    this.initDays();
  }

  initDays() {
    if (/d|dd/.test(this.format)) {
      this.days.length = 0;
      // 获取当前选中月总共有多少天
      const date = new Date();
      date.setFullYear(this.currentDate.year);
      date.setDate(1);
      date.setMonth(this.currentDate.month + 1);
      date.setDate(0);
      let startDay = 1;
      let endDay = date.getDate();

      if (this.currentDate.year <= this._minDate.year) {
        if (this.currentDate.month <= this._minDate.month) {
          startDay = this._minDate.day;
        }
      }
      if (this.currentDate.year >= this._maxDate.year) {
        if (this.currentDate.month >= this._maxDate.month) {
          endDay = this._maxDate.day;
        }
      }

      for (; startDay <= endDay; startDay++) {
        this.days.push({
          text: startDay + '日',
          value: startDay
        });
      }
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
    let value: string | number;
    if (this.format) {
      value = this.currentDate.toStringByFormatString(this.format);
    } else {
      value = this.currentDate.timestamp;
    }

    this.displayValue = this.currentDate.toStringByFormatString(this.displayFormat || this.format);
    if (this.onChange) {
      this.onChange(value);
    }
    if (this.onTouched) {
      this.onTouched(value);
    }
    this._value = value;
    this.uiChange.emit(value);
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