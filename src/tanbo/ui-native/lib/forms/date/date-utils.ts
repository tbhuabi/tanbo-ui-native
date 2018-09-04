export class UIDate {
  get timestamp() {
    return this.date.getTime();
  }

  set year(v: number) {
    this.date.setFullYear(v);
  }

  get year() {
    return this.date.getFullYear();
  }

  set month(v: number) {
    const date = new Date(this.timestamp);
    date.setMonth(v + 1, 0);
    const day = date.getDate();
    if (day < this.day) {
      this.date.setMonth(v, day);
      return;
    }
    this.date.setMonth(v);
  }

  get month() {
    return this.date.getMonth();
  }

  set day(v: number) {
    this.date.setDate(v);
  }

  get day() {
    return this.date.getDate();
  }

  set hours(v: number) {
    this.date.setHours(v);
  }

  get hours() {
    return this.date.getHours();
  }

  set minutes(v: number) {
    this.date.setMinutes(v);
  }

  get minutes() {
    return this.date.getMinutes();
  }

  set seconds(v: number) {
    this.date.setSeconds(v);
  }

  get seconds() {
    return this.date.getSeconds();
  }

  private date: Date;

  constructor(private d?: number | string | Date) {
    if (typeof d === 'number') {
      this.date = new Date(d);
    } else if (typeof d === 'string') {
      this.date = this.stringToDate(d);
    } else if (d instanceof Date) {
      this.date = d;
    } else {
      this.date = new Date();
    }
  }

  toStringByFormatString(s: string) {
    const date = new Date();
    date.setTime(this.timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    return s.replace(/[yMdhms]+/g, (str: string): string => {
      switch (str) {
        case 'yy':
          return year ? toDouble(year % 100) : '';
        case 'yyyy':
          return year + '';
        case 'M':
          return month + '';
        case 'MM':
          return toDouble(month);
        case 'd':
          return day + '';
        case 'dd':
          return toDouble(day);
        case 'h':
          return hours + '';
        case 'hh':
          return toDouble(hours);
        case 'm':
          return minutes + '';
        case 'mm':
          return toDouble(minutes);
        case 's':
          return seconds + '';
        case 'ss':
          return toDouble(seconds);
        default:
          return str;
      }
    });
  }

  private stringToDate(s: string): Date {
    let dateArr: Array<number> = s.match(/\d+/g).map(item => {
      return +item;
    });
    const arr = [0, 0, 1, 0, 0, 0];
    dateArr = dateArr.concat(arr.slice(dateArr.length));
    const date = new Date();
    date.setFullYear(dateArr[0]);
    date.setMonth(dateArr[1] - 1);
    date.setDate(dateArr[2]);
    date.setHours(dateArr[3]);
    date.setMinutes(dateArr[4]);
    date.setSeconds(dateArr[5]);
    date.setMilliseconds(0);
    return date;
  }
}

/**
 * 给0-9的数字补零，转为00、01……
 * @param n 0-9的数字
 */
export function toDouble(n: number | string): string {
  return n > 9 ? n + '' : '0' + n;
}
