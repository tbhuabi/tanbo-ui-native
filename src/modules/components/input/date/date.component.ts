import { Component, Input, EventEmitter, OnInit, Output } from '@angular/core';

import { InputType } from '../input-type';

export interface TimeDetails {
    year?: number;
    month?: number;
    day?: number;
    hours?: number;
    minutes?: number;
    seconds?: number;
    timestamp?: number;
    disabled?: boolean;
}

@Component({
    selector: 'ui-input-date',
    templateUrl: './date.component.html'
})
export class DateComponent implements OnInit, InputType {
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
    placeholder: string = '';
    @Input()
    value: string;
    @Input()
    format: string = '';
    @Output()
    change = new EventEmitter<string>();
    @Output()
    state = new EventEmitter<boolean>();

    @Input()
    set maxDate(value) {
        this._maxDate = value || '';
        this.maxDateTimeDetails = DateComponent.timeAnalysisByTimeString(this._maxDate);
        this.update();
    }

    get maxDate() {
        return this._maxDate;
    }

    @Input()
    set minDate(value) {
        this._minDate = value || '';
        this.minDateTimeDetails = DateComponent.timeAnalysisByTimeString(this._minDate);
        this.update();
    }

    get minDate() {
        return this._minDate;
    }

    get showHMS(): boolean {
        return /[hms]/.test(this.format);
    }

    dayList: Array<Array<TimeDetails>> = [];
    minDateTimeDetails: TimeDetails = {};
    maxDateTimeDetails: TimeDetails = {};
    systemDateTimeDetails: TimeDetails = {};
    currentDateTimeDetails: TimeDetails = {};
    selectedDateTimeDetails: TimeDetails = {};
    startYearIndex: number;
    years: Array<any> = [];
    months: Array<any> = [];

    showType: string = '';
    open: boolean = false;

    private _disabled: boolean;
    private _readonly: boolean;
    private _maxDate = '';
    private _minDate = '';
    private days: Array<TimeDetails> = [];

    static timeAnalysisByTimeString(date: string): TimeDetails {
        if (!date) {
            return;
        }
        let result = null;
        let dateArr: Array<number> = date.match(/\d+/g).map(item => {
            return +item;
        });
        if (dateArr.length === 3) {
            dateArr = dateArr.concat([0, 0, 0]);
        }
        if (dateArr.length !== 6) {
            return result;
        }
        result = {
            year: dateArr[0],
            month: dateArr[1] - 1,
            day: dateArr[2],
            hours: dateArr[3],
            minutes: dateArr[4],
            seconds: dateArr[5],
            timestamp: 0
        };
        let dateInstance = new Date();
        dateInstance.setFullYear(result.year);
        dateInstance.setMonth(result.month);
        dateInstance.setDate(result.day);
        dateInstance.setHours(result.hours);
        dateInstance.setMinutes(result.minutes);
        dateInstance.setSeconds(result.seconds);
        dateInstance.setMilliseconds(0);

        let year = dateInstance.getFullYear();
        let month = dateInstance.getMonth();
        let day = dateInstance.getDate();
        let hours = dateInstance.getHours();
        let minutes = dateInstance.getMinutes();
        let seconds = dateInstance.getSeconds();
        return {
            year,
            month,
            day,
            hours,
            minutes,
            seconds,
            timestamp: Date.UTC(year, month, day, hours, minutes, seconds, 0)
        };
    }

    /**
     * 给0-9的数字补零，转为00、01……
     * @param {number|string} n 0-9的数字
     * @returns {string}
     */
    static toDouble(n: number | string): string {
        if (n === undefined || n === '') {
            return '';
        }
        return n > 9 ? n + '' : '0' + n;
    }

    ngOnInit() {
        // 初始化日历组件，并缓存当前的年月日
        let date: Date = new Date();

        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();
        let timestamp = Date.UTC(year, month, day, hours, minutes, seconds, 0);

        this.systemDateTimeDetails = {
            year,
            month,
            day,
            hours,
            minutes,
            seconds,
            timestamp
        };
        if (this.minDate && timestamp < this.minDateTimeDetails.timestamp) {
            this.currentDateTimeDetails = JSON.parse(JSON.stringify(this.minDateTimeDetails));
        } else if (this.maxDate && timestamp > this.maxDateTimeDetails.timestamp) {
            this.currentDateTimeDetails = JSON.parse(JSON.stringify(this.maxDateTimeDetails));
        } else {
            this.currentDateTimeDetails = {
                year,
                month,
                day,
                hours,
                minutes,
                seconds,
                timestamp
            };
        }
        this.startYearIndex = this.currentDateTimeDetails.year - this.currentDateTimeDetails.year % 16;
        this.update();
    }

    changeShowType(type?: string) {
        this.showType = this.showType === type ? '' : type;
    }

    trigger() {
        if (this.readonly || this.disabled) {
            return;
        }
        this.open = !this.open;
        this.state.emit(true);
    }

    onEscape() {
        this.open = false;
        this.state.emit(this.open);
    }

    setYears(year: number) {
        this.startYearIndex = year;
        this.updateYearList();
    }

    checkYear(obj: any) {
        if (obj.disable) {
            return;
        }
        this.currentDateTimeDetails.year = obj.year;
        this.update();
    }

    setMonth(obj: any) {
        if (obj.isDisable) {
            return;
        }
        this.currentDateTimeDetails.month = obj.month;
        this.update();
    }

    selected(day: TimeDetails) {
        if (day.disabled) {
            return;
        }
        this.selectedDateTimeDetails.year = day.year;
        this.selectedDateTimeDetails.month = day.month;
        this.selectedDateTimeDetails.day = day.day;
        this.validateSelectedDate();
    }

    testValue(max: number, key: string, $event: any) {
        let selectedDate = this.selectedDateTimeDetails;
        if (selectedDate[key] > max) {
            let currentValue = (selectedDate[key] + '').replace(/\d$/, '');
            $event.target.value = currentValue;
            selectedDate[key] = +currentValue;
        }
        this.validateSelectedDate();
    }

    // 通过传入的format字符串，格式化选中后的日期数据
    getResult() {
        let selectedDate: TimeDetails = this.selectedDateTimeDetails;
        let formatString: string = this.format;
        let toDouble: (n: number | string) => string = DateComponent.toDouble;
        this.open = false;
        this.state.emit(this.open);

        if (formatString) {
            let result = formatString.replace(/[yMdhms]+/g, (str: string): string => {
                switch (str) {
                    case 'yy':
                        return selectedDate.year ? toDouble(selectedDate.year % 100) : '';
                    case 'yyyy':
                        return selectedDate.year + '';
                    case 'M':
                        return (selectedDate.month ? selectedDate.month + 1 : '') + '';
                    case 'MM':
                        return toDouble(selectedDate.month !== undefined ? selectedDate.month + 1 : '');
                    case 'd':
                        return selectedDate.day + '';
                    case 'dd':
                        return toDouble(selectedDate.day);
                    case 'h':
                        return (selectedDate.hours || '0') + '';
                    case 'hh':
                        return toDouble(selectedDate.hours) || '00';
                    case 'm':
                        return (selectedDate.minutes || '0') + '';
                    case 'mm':
                        return toDouble(selectedDate.minutes) || '00';
                    case 's':
                        return (selectedDate.seconds || '0') + '';
                    case 'ss':
                        return toDouble(selectedDate.seconds) || '00';
                    default:
                        return str;
                }
            });
            this.value = result;
            this.change.emit(result);
            return;
        }

        // 通过正则匹配format字符串，并更新相应结果

        // 调用外部回调，传回格式化后的字符串
        let date = new Date();
        date.setFullYear(selectedDate.year || 0);
        date.setMonth(selectedDate.month || 0);
        date.setDate(selectedDate.day || 0);
        date.setHours(selectedDate.hours || 0);
        date.setMinutes(selectedDate.minutes || 0);
        date.setSeconds(selectedDate.seconds || 0);

        this.value = date.getDate() + '';
        this.change.emit(date.getTime() + '');
    }

    private validateSelectedDate() {
        let selectedDate = this.selectedDateTimeDetails;
        if (!selectedDate.year) {
            return;
        }
        let n = Date.UTC(selectedDate.year,
            selectedDate.month,
            selectedDate.day,
            selectedDate.hours || 0,
            selectedDate.minutes || 0,
            selectedDate.seconds || 0, 0);
        if (this.minDateTimeDetails) {
            if (n < this.minDateTimeDetails.timestamp) {
                this.selectedDateTimeDetails = JSON.parse(JSON.stringify(this.minDateTimeDetails));
            } else if (this.maxDateTimeDetails && n > this.maxDateTimeDetails.timestamp) {
                this.selectedDateTimeDetails = JSON.parse(JSON.stringify(this.maxDateTimeDetails));
            }
        } else if (this.maxDateTimeDetails && n > this.maxDateTimeDetails.timestamp) {
            this.selectedDateTimeDetails = JSON.parse(JSON.stringify(this.maxDateTimeDetails));
        }
    }

    private update() {
        // 通过当前的年月日，计算显示在日历控件中的年月日
        let currentDate = this.currentDateTimeDetails;
        if (!currentDate.year) {
            return;
        }
        let date = new Date();
        date.setFullYear(currentDate.year);
        date.setMonth(currentDate.month + 1, 0);
        let testDay = date.getDate();
        if (currentDate.day > testDay) {
            currentDate.day = testDay;
        }
        date.setDate(currentDate.day);
        date.setHours(currentDate.hours);
        date.setMinutes(currentDate.minutes);
        date.setSeconds(currentDate.seconds);
        date.setMilliseconds(currentDate.seconds);

        let year = date.getFullYear();
        let month = date.getMonth();
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let seconds = date.getSeconds();

        this.currentDateTimeDetails = {
            year,
            month,
            day,
            hours,
            minutes,
            seconds,
            timestamp: Date.UTC(year, month, day, hours, minutes, seconds, 0)
        };

        this.updateYearList();
        this.updateMonthList();
        this.updateDayList();
    }

    private updateDayList() {
        this.setDays();
        this.dayList = [];
        let child: Array<TimeDetails> = [];
        let dayMaxMillisecond = 24 * 60 * 60 * 1000;
        let timeRemainder;
        let startDayTimestamp;
        if (this.minDateTimeDetails) {
            timeRemainder = this.minDateTimeDetails.timestamp % dayMaxMillisecond;
            startDayTimestamp = this.minDateTimeDetails.timestamp - timeRemainder;
        }
        for (let i = 0; i < this.days.length; i++) {
            let currentTimestamp = this.days[i].timestamp;
            if (this.minDateTimeDetails) {
                if (currentTimestamp < startDayTimestamp) {
                    this.days[i].disabled = true;
                } else if (this.maxDateTimeDetails && currentTimestamp > this.maxDateTimeDetails.timestamp) {
                    this.days[i].disabled = true;
                }
            } else if (this.maxDateTimeDetails) {
                this.days[i].disabled = currentTimestamp > this.maxDateTimeDetails.timestamp;
            } else {
                this.days[i].disabled = false;
            }

            if (i % 7 === 0) {
                child = [];
                this.dayList.push(child);
            }
            child.push(this.days[i]);
        }
    }

    private updateMonthList() {
        this.months = [];
        for (let i = 0; i < 12; i++) {
            this.months.push({
                month: i,
                isDisable: this.isDisableMonth(i)
            });
        }
    }

    private updateYearList() {
        let startIndex: number = this.startYearIndex;
        this.years = [];
        let endIndex = startIndex + 16;
        while (startIndex < endIndex) {
            this.years.push({
                year: startIndex,
                isDisable: this.isDisableYear(startIndex)
            });
            startIndex++;
        }
    }

    private isDisableMonth(month: number): boolean {
        let r = this.isDisableYear(this.currentDateTimeDetails.year);
        if (r) {
            return true;
        }
        if (this.minDateTimeDetails && this.currentDateTimeDetails.year === this.minDateTimeDetails.year) {
            return month < this.minDateTimeDetails.month;
        }
        if (this.maxDateTimeDetails && this.maxDateTimeDetails.year === this.maxDateTimeDetails.year) {
            return month > this.maxDateTimeDetails.month;
        }
        return false;
    }

    private isDisableYear(year: number): boolean {
        return (this.minDateTimeDetails && year < this.minDateTimeDetails.year ||
        this.maxDateTimeDetails && year > this.maxDateTimeDetails.year);
    }

    // 通过当前时间，计算上一月，当前月，及下一月的天数，并把所有天数添加到天数的集合，以更新显示在日历控件中的数据
    private setDays() {
        this.days = [];
        // 通过当前时间初始化date对象
        let dateInstance: Date = new Date();
        dateInstance.setFullYear(this.currentDateTimeDetails.year);
        dateInstance.setMonth(this.currentDateTimeDetails.month, 1);
        dateInstance.setHours(0);
        dateInstance.setMinutes(0);
        dateInstance.setSeconds(0);
        dateInstance.setMilliseconds(0);

        // 拿到当月第一天是星期几
        let currentMonthStartWeek = dateInstance.getDay();

        // 把当前时间设到上一月最后一天，并拿到最后一天的大小
        dateInstance.setDate(0);
        let prevMonthDayStartSize = dateInstance.getDate() - currentMonthStartWeek;

        // 获取上一月的年月
        let month = dateInstance.getMonth();
        let year = dateInstance.getFullYear();
        // 添加上一月的天数到days数据中
        for (let i = 0; i < currentMonthStartWeek; i++) {
            this.days.push({
                year,
                month,
                day: prevMonthDayStartSize + i + 1,
                hours: 0,
                minutes: 0,
                seconds: 0,
                timestamp: Date.UTC(year, month, prevMonthDayStartSize + i + 1, 0, 0, 0, 0),
            });
        }
        // 把上一月的时间设置为1日，防止溢出
        dateInstance.setDate(1);
        // 把当前时间设置到下一月
        dateInstance.setMonth(month + 2);
        // 把当前时间设置到当月的最后一天，并获取年月，及更新相应数据
        dateInstance.setDate(0);
        year = dateInstance.getFullYear();
        month = dateInstance.getMonth();
        this.currentDateTimeDetails.year = year;
        this.currentDateTimeDetails.month = month;
        let currentMonthLastDayNumber = dateInstance.getDate();
        // 添加当前月的天数到days数据中
        for (let i = 0; i < currentMonthLastDayNumber; i++) {
            this.days.push({
                year,
                month,
                day: i + 1,
                hours: 0,
                minutes: 0,
                seconds: 0,
                timestamp: Date.UTC(year, month, i + 1, 0, 0, 0, 0),
            });
        }
        // 把当月时间设置为1日，防止溢出
        dateInstance.setDate(1);
        // 把当前时间设置到下一月，并获取年月
        dateInstance.setMonth(month + 1);
        year = dateInstance.getFullYear();
        month = dateInstance.getMonth();
        let nextMonthDaysSize = 42 - this.days.length;
        // 添加下一月的天数到days数据中
        for (let i = 0; i < nextMonthDaysSize; i++) {
            this.days.push({
                year,
                month,
                day: i + 1,
                hours: 0,
                minutes: 0,
                seconds: 0,
                timestamp: Date.UTC(year, month, i + 1, 0, 0, 0, 0)
            });
        }
    }
}