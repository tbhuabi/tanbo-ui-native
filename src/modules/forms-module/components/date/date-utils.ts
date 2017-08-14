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

export function timeAnalysisByTimeString(date: string): TimeDetails {
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
export function toDouble(n: number | string): string {
    if (n === undefined || n === '') {
        return '';
    }
    return n > 9 ? n + '' : '0' + n;
}

export function dateStringFormat(formatString: string, selectedDate: TimeDetails): string {
    return formatString.replace(/[yMdhms]+/g, (str: string): string => {
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
}