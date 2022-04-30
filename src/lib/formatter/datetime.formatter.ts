import { DateTime } from "../datetime";
import { assert } from "../error/assert.error";
import { DateTimeFormatError } from "../error/date-format.error";
import { NUMBER_0, NUMBER_1, NUMBER_10, NUMBER_100, NUMBER_11, NUMBER_12, NUMBER_17, NUMBER_2, NUMBER_21, NUMBER_22, NUMBER_23, NUMBER_28, NUMBER_29, NUMBER_3, NUMBER_30, NUMBER_31, NUMBER_4, NUMBER_400, NUMBER_5, NUMBER_6, NUMBER_7, NUMBER_8, NUMBER_9, NUMBER_MIN_1 } from "../util/datetime.constant";
import { DateTimeFormat } from "./datetime.format";

export class DateTimeFormatter {
  private _dateTimeFormatBuilder!: DateTimeFormatterBuilder;

  private constructor() { }

  static get init() {
    return new DateTimeFormatter();
  }

  ofPattern(pattern: string | DateTimeFormat): DateTimeFormatter {
    let newPattern: DateTimeFormat;
    const isStringPattern = typeof pattern === 'string';
    if (isStringPattern) {
      newPattern = new DateTimeFormat().of(pattern);
    } else {
      newPattern = pattern;
    }
    this._dateTimeFormatBuilder = new DateTimeFormatterBuilder().appendPattern(newPattern).build();

    return this;
  }

  format(dateTime: DateTime): string {
    return this._dateTimeFormatBuilder.format(dateTime);
  }

  parse(dateTimeInStr: string): DateTime {
    return this._dateTimeFormatBuilder.parse(dateTimeInStr);
  }

  /**
   * public static final DateTimeFormatter BASIC_ISO_DATE
   * The ISO date formatter that formats or parses a date without an offset, such as '20111203'.
   * This returns an immutable formatter capable of formatting and parsing the ISO-8601 basic local date format. The format consists of:
   * Four digits for the year. Only years in the range 0000 to 9999 are supported.
   * Two digits for the month-of-year. This is pre-padded by zero to ensure two digits.
   * Two digits for the day-of-month. This is pre-padded by zero to ensure two digits.
   * If the offset is not available to format or parse then the format is complete.
   * The offset ID without colons. If the offset has seconds then they will be handled even though this is not part of the ISO-8601 standard. Parsing is case insensitive.
   * As this formatter has an optional element, it may be necessary to parse using parseBest(java.lang.CharSequence, java.time.temporal.TemporalQuery<?>...).
   * The returned formatter has a chronology of ISO set to ensure dates in other calendar systems are correctly converted. It has no override zone and uses the STRICT resolver style.
   */
  static get BASIC_ISO_DATE() {
    return DateTimeFormatter.init.ofPattern('yyyyMMdd');
  };

}

// tslint:disable-next-line: max-classes-per-file
class DateTimeFormatterBuilder {
  private _currentPattern: DateTimeFormatPattern = DateTimeFormatPattern.build();
  private monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  appendPattern(pattern: DateTimeFormat): DateTimeFormatterBuilder {
    assert(pattern == null, 'Pattern found as null');
    this._currentPattern = DateTimeFormatPattern.build().convert(pattern);

    return this;
  }

  build(): DateTimeFormatterBuilder {
    return this;
  }

  format(dateTime: DateTime): string {
    return this._format(dateTime, this._currentPattern.pattern);
  }

  parse(dateTimeInStr: string): DateTime {
    try {
      return this._parse(dateTimeInStr, this._currentPattern);
      // tslint:disable-next-line: no-any
    } catch (error: any) {
      // tslint:disable-next-line: no-unsafe-any
      throw new DateTimeFormatError('Date Time Parsing error', error);
    }
  }

  /**
   * Format the DateTime
   * @param dateTime DateTime instance
   * @param format DateTimeFormatter
   */
  private _format(dateTime: DateTime, format: string = DateTimeFormat.ISO_8601): string {
    let formattedDateTime = '';
    let nextCharacterIsEscaped = false;
    let prevHoldValue = '';
    const formatArray = format.match(/(.)(?=\1)\1+|(.)(?!\2)/g) ?? [];
    formatArray.forEach((notation) => {
      let value: string;
      if (nextCharacterIsEscaped && (prevHoldValue !== '' && prevHoldValue !== notation)) {
        formattedDateTime += notation;
      } else {
        switch (notation) {
          case 'd':
            value = dateTime.getDate().toString();
            break;
          case 'dd':
            value = dateTime.getDate().toString().padStart(NUMBER_2, '0');
            break;
          case 'y':
          case 'yyy':
          case 'yyyy':
          case 'Y':
          case 'YYY':
          case 'YYYY':
          case 'u':
          case 'uuu':
          case 'uuuu':
            value = dateTime.year.toString();
            break;
          case 'uu':
          case 'YY':
          case 'yy':
            value = dateTime.year.toString();
            value = value.substring(value.length - NUMBER_2);
            break;
          case 'L':
          case 'M':
            value = (dateTime.month + NUMBER_1).toString();
            break;
          case 'LL':
          case 'MM':
            value = (dateTime.month + NUMBER_1).toString().padStart(NUMBER_2, '0');
            break;
          case 'LLL':
          case 'MMM':
            value = this._month(dateTime.month + NUMBER_1, true);
            break;
          case 'LLLL':
          case 'MMMM':
            value = this._month(dateTime.month + NUMBER_1, false);
            break;
          case 'LLLLL':
          case 'MMMMM':
            value = this._month(dateTime.month + NUMBER_1, false).substring(NUMBER_0, NUMBER_1);
            break;
          // 12-hour format of an hour (1 through 12)
          case 'K':
          case 'h':
            value = (dateTime.getHours() % NUMBER_12).toString();
            if (value === '0') value = '12';
            break;
          // 12-hour format of an hour (01 through 12) with padding
          case 'KK':
          case 'hh':
            value = (dateTime.getHours() % NUMBER_12).toString().padStart(NUMBER_2, '0');
            if (value === '00') value = '12';
            break;
          // 24-hour format of an hour (0 through 23)
          case 'k':
          case 'H':
            value = dateTime.getHours().toString();
            break;
          // 24-hour format of an hour (00 through 23) with padding
          case 'kk':
          case 'HH':
            value = dateTime.getHours().toString().padStart(NUMBER_2, '0');
            break;
          // Minutes
          case 'm':
            value = dateTime.getMinutes().toString();
            break;
          case 'mm':
            value = dateTime.getMinutes().toString().padStart(NUMBER_2, '0');
            break;
          // Seconds
          case 's':
            value = dateTime.getSeconds().toString();
            break;
          case 'ss':
            value = dateTime.getSeconds().toString().padStart(NUMBER_2, '0');
            break;
          // Milliseconds (0 - 999)
          case 'S':
            value = dateTime.getMilliseconds().toString();
            break;
          case 'SS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_2, '0');
            break;
          case 'SSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_3, '0');
            break;
          case 'SSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_4, '0');
            break;
          case 'SSSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_5, '0');
            break;
          case 'SSSSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_6, '0');
            break;
          case 'SSSSSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_7, '0');
            break;
          case 'SSSSSSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_8, '0');
            break;
          case 'SSSSSSSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_9, '0');
            break;
          case 'n':
            value = dateTime.nanoSeconds.toString();
            break;
          case 'a':
            value = dateTime.meridiem();
            break;
          case 'q':
          case 'Q':
            value = this._getQuarterOfYear(dateTime).toString();
            break;
          case 'D':
            value = this._dayOfYear(dateTime).toString();
            break;
          case 'DD':
            value = this._dayOfYear(dateTime).toString().padStart(NUMBER_2, '0');
            break;
          case 'DDD':
            value = this._dayOfYear(dateTime).toString().padStart(NUMBER_3, '0');
            break;
          case 'G':
          case 'GG':
          case 'GGG':
            value = 'AD';
            break;
          case 'GGGG':
            value = 'Anno Domini';
            break;
          case 'GGGGG':
            value = 'A';
            break;
          case 'w':
            value = this._weekNumber(dateTime).toString();
            break;
          case 'ww':
            value = this._weekNumber(dateTime).toString().padStart(NUMBER_2, '0');
            break;
          case 'W':
            value = this._getWeek(dateTime).toString();
            break;
          case 'E':
          case 'EE':
          case 'EEE':
          case 'eee':
          case 'ccc':
            value = this._dayOfWeek(dateTime.weekDay + NUMBER_1, true);
            break;
          case 'EEEE':
          case 'eeee':
          case 'cccc':
            value = this._dayOfWeek(dateTime.weekDay + NUMBER_1, false);
            break;
          case 'EEEEE':
          case 'eeeee':
          case 'ccccc':
            value = this._dayOfWeek(dateTime.weekDay + NUMBER_1, false).substring(NUMBER_0, NUMBER_1);
            break;
          case 'e':
            value = (dateTime.weekDay + NUMBER_1).toString();
            break;
          case 'ee':
            value = (dateTime.weekDay + NUMBER_1).toString().padStart(NUMBER_2, '0');
            break;
          case 'eee':
            value = this._dayOfWeek(dateTime.weekDay + NUMBER_1, true);
            break;
          case 'Z':
          case 'ZZ':
          case 'ZZZ':
            value = dateTime.toTimeString().slice(NUMBER_12, NUMBER_17);
            break;
          case 'ZZZZ':
            value = dateTime.toTimeString().slice(NUMBER_9, NUMBER_12);
            break;
          case 'ZZZZZ':
            value = 'Z'
            break;
          case 'P':
            value = this._suffixOfDay(dateTime.getDate())
            break;
          case '\'':
            nextCharacterIsEscaped = prevHoldValue === notation ? false : true;
            prevHoldValue = prevHoldValue === notation ? '' : notation;
            value = '';
            break;
          default:
            value = notation;
        }
        formattedDateTime += value ?? notation;
      }
    });

    return formattedDateTime;
  }

  /// Returns the name of the month, abbreviated if [abbr] is `true`.
  ///
  /// [month] must be in the range of `1-12`.
  private _month(month: number, abbr: boolean): string {
    assert(month >= NUMBER_1 && month <= NUMBER_12);
    let nameOfMonth = '';
    switch (month) {
      case NUMBER_1:
        nameOfMonth = abbr ? 'Jan' : 'January';
        break;
      case NUMBER_2:
        nameOfMonth = abbr ? 'Feb' : 'February';
        break;
      case NUMBER_3:
        nameOfMonth = abbr ? 'Mar' : 'March';
        break;
      case NUMBER_4:
        nameOfMonth = abbr ? 'Apr' : 'April';
        break;
      case NUMBER_5:
        nameOfMonth = 'May';
        break;
      case NUMBER_6:
        nameOfMonth = abbr ? 'Jun' : 'June';
        break;
      case NUMBER_7:
        nameOfMonth = abbr ? 'Jul' : 'July';
        break;
      case NUMBER_8:
        nameOfMonth = abbr ? 'Aug' : 'August';
        break;
      case NUMBER_9:
        nameOfMonth = abbr ? 'Sep' : 'September';
        break;
      case NUMBER_10:
        nameOfMonth = abbr ? 'Oct' : 'October';
        break;
      case NUMBER_11:
        nameOfMonth = abbr ? 'Nov' : 'November';
        break;
      case NUMBER_12:
        nameOfMonth = abbr ? 'Dec' : 'December';
        break;
      default:
        break;
    }

    return nameOfMonth;
  }

  private _reverseMonth(month: string, abbr: boolean, singleChar?: boolean): number {
    if (singleChar) {
      assert(this.monthList.map(val => val.substring(NUMBER_0, NUMBER_1)).indexOf(month) !== NUMBER_MIN_1);
    } else {
      assert(abbr ? this.monthList.map(val => val.substring(NUMBER_0, NUMBER_2)).indexOf(month) !== NUMBER_MIN_1 : this.monthList.indexOf(month) !== NUMBER_MIN_1);
    }
    let nameOfMonth = NUMBER_MIN_1;
    // tslint:disable-next-line: no-duplicate-case
    switch (month) {
      case 'J':
      case 'Jan':
      case 'January':
        nameOfMonth = NUMBER_0;
        break;
      case 'F':
      case 'Feb':
      case 'February':
        nameOfMonth = NUMBER_1;
        break;
      case 'M':
      case 'Mar':
      case 'March':
        nameOfMonth = NUMBER_2;
        break;
      case 'A':
      case 'Apr':
      case 'April':
        nameOfMonth = NUMBER_3;
        break;
      case 'M':
      case 'May':
        nameOfMonth = NUMBER_4;
        break;
      case 'J':
      case 'Jun':
      case 'June':
        nameOfMonth = NUMBER_5;
        break;
      case 'J':
      case 'Jul':
      case 'July':
        nameOfMonth = NUMBER_6;
        break;
      case 'A':
      case 'Aug':
      case 'August':
        nameOfMonth = NUMBER_7;
        break;
      case 'S':
      case 'Sep':
      case 'September':
        nameOfMonth = NUMBER_8;
        break;
      case 'O':
      case 'Oct':
      case 'October':
        nameOfMonth = NUMBER_9;
        break;
      case 'N':
      case 'Nov':
      case 'November':
        nameOfMonth = NUMBER_10;
        break;
      case 'D':
      case 'Dec':
      case 'December':
        nameOfMonth = NUMBER_11;
        break;
      default:
        break;
    }

    return nameOfMonth;
  }
  /**
   * Returns Quarter of the year
   * @param dateTime DatetTime
   * @returns number
   */
  private _getQuarterOfYear(dateTime: DateTime): number {
    const month = dateTime.month + NUMBER_1;

    return (Math.ceil(month / NUMBER_3));
  }

  /// Returns the day of the year starting from 0.
  private _dayOfYear(dateTime: DateTime): number {
    let dayOfYear = dateTime.date;
    const month = dateTime.month + NUMBER_1;
    const year = dateTime.year;
    for (let i = NUMBER_1; i < month; i++) {
      dayOfYear += this._daysInMonth(i, year);
    }

    return dayOfYear;
  }

  /// Returns the number of days in [month].
  private _daysInMonth(month: number, year: number): number {
    assert(month >= NUMBER_1 && month <= NUMBER_12);

    let days = NUMBER_0;

    switch (month) {
      case NUMBER_1:
        days = NUMBER_31;
        break;
      case NUMBER_2:
        days = this._isLeapYear(year) ? NUMBER_29 : NUMBER_28;
        break;
      case NUMBER_3:
        days = NUMBER_31;
        break;
      case NUMBER_4:
        days = NUMBER_30;
        break;
      case NUMBER_5:
        days = NUMBER_31;
        break;
      case NUMBER_6:
        days = NUMBER_30;
        break;
      case NUMBER_7:
        days = NUMBER_31;
        break;
      case NUMBER_8:
        days = NUMBER_31;
        break;
      case NUMBER_9:
        days = NUMBER_30;
        break;
      case NUMBER_10:
        days = NUMBER_31;
        break;
      case NUMBER_11:
        days = NUMBER_30;
        break;
      case NUMBER_12:
        days = NUMBER_31;
        break;
      default:
        break;
    }

    return days;
  }

  /// Returns `true` if [year] is a leap year, otherwise returns `false`.
  private _isLeapYear(year: number): boolean {
    // tslint:disable-next-line: no-magic-numbers
    return year % NUMBER_100 === NUMBER_0 ? year % NUMBER_400 === NUMBER_0 : year % NUMBER_4 === NUMBER_0;
  }

  private _weekNumber(dateTime: DateTime): number {
    const numberOfDays = this._dayOfYear(dateTime);

    return Math.ceil(((dateTime.getDay() + numberOfDays) / NUMBER_7) + NUMBER_1);
  }

  /// Returns the name of the day of the week, abbreviated if [abbr] is `true`.
  ///
  /// [dayOfWeek] must be in the range of `1-7`.
  ///
  /// The week starts from Monday.
  private _dayOfWeek(dayOfWeek: number, abbr: boolean) {
    assert(dayOfWeek >= NUMBER_1 && dayOfWeek <= NUMBER_7);

    let nameOfDay = '';
    switch (dayOfWeek) {
      case NUMBER_1:
        nameOfDay = abbr ? 'Sun' : 'Sunday';
        break;
      case NUMBER_2:
        nameOfDay = abbr ? 'Mon' : 'Monday';
        break;
      case NUMBER_3:
        nameOfDay = abbr ? 'Tue' : 'Tuesday';
        break;
      case NUMBER_4:
        nameOfDay = abbr ? 'Wed' : 'Wednesday';
        break;
      case NUMBER_5:
        nameOfDay = abbr ? 'Thu' : 'Thursday';
        break;
      case NUMBER_6:
        nameOfDay = abbr ? 'Fri' : 'Friday';
        break;
      case NUMBER_7:
        nameOfDay = abbr ? 'Sat' : 'Saturday';
        break;
      default:
        break;
    }

    return nameOfDay;
  }

  private _getWeek(date: DateTime): number {
    const monthStart = new Date(date);
    monthStart.setDate(NUMBER_0);
    const offset = (monthStart.getDay() + NUMBER_1) % NUMBER_7; // -1 is for a week starting on Monday

    return Math.ceil((date.getDate() + offset) / NUMBER_7);
  }

  /// Returns the suffix (`st`, `nd`, `rd`, or `th`) of [day].
  private _suffixOfDay(day: number): string {
    if (day === NUMBER_1 || day === NUMBER_21 || day === NUMBER_31) {
      return 'st';
    } else if (day === NUMBER_2 || day === NUMBER_22) {
      return 'nd';
    } else if (day === NUMBER_3 || day === NUMBER_23) {
      return 'rd';
    }

    return 'th';
  }

  private _parse(dateTimeInString: string, format: DateTimeFormatPattern): DateTime {
    let skipLength = 0;
    if (format.isAmPmInFormat()) {
      skipLength = 1;
    }
    const pattern = format.pattern;
    assert(pattern.length === (dateTimeInString.length - skipLength), 'format and actual data input length mismatch!')
    const dateTime = new DateTime();
    let formattedDateTime = '';
    let nextCharacterIsEscaped = false;
    let prevHoldValue = '';
    let startIndex = 0;
    let endIndex = 0;
    const formatArray = pattern.match(/(.)(?=\1)\1+|(.)(?!\2)/g) ?? [];
    const dateTimeStringArray: string[] = new Array<string>();
    formatArray.map(value => {
      endIndex += (value.length + skipLength);
      dateTimeStringArray.push(dateTimeInString.substring(startIndex, endIndex));
      startIndex += value.length;
    });
    assert(formatArray.length === dateTimeStringArray.length, 'format and actual data length mismatch!')
    formatArray.forEach((notation, index) => {
      let value = '';
      if (nextCharacterIsEscaped && (prevHoldValue !== '' && prevHoldValue !== notation)) {
        formattedDateTime += notation;
      } else {
        switch (notation) {
          case 'd':
            dateTime.date = Number(dateTimeStringArray[index]);
            break;
          case 'dd':
            dateTime.date = Number(dateTimeStringArray[index].padStart(NUMBER_2, '0'));
            break;
          case 'y':
          case 'yyy':
          case 'yyyy':
          case 'Y':
          case 'YYY':
          case 'YYYY':
          case 'u':
          case 'uuu':
          case 'uuuu':
            dateTime.year = Number(dateTimeStringArray[index]);
            break;
          case 'uu':
          case 'YY':
          case 'yy':
            const yearPadding = dateTime.year.toString().substring(0, NUMBER_2);
            dateTime.year = Number(`${yearPadding}${dateTimeStringArray[index]}`);
            break;
          case 'L':
          case 'M':
            dateTime.month = Number(dateTimeStringArray[index]) - 1;
            break;
          case 'LL':
          case 'MM':
            dateTime.month = Number(dateTimeStringArray[index].padStart(NUMBER_2, '0')) - 1;
            break;
          case 'LLL':
          case 'MMM':
            dateTime.month = this._reverseMonth(dateTimeStringArray[index], true);
            break;
          case 'LLLL':
          case 'MMMM':
            dateTime.month = this._reverseMonth(dateTimeStringArray[index], false);
            break;
          case 'LLLLL':
          case 'MMMMM':
            dateTime.month = this._reverseMonth(dateTimeStringArray[index], false, true);
            break;
          // 12-hour format of an hour (1 through 12)
          case 'K':
          case 'h':
            dateTime.hours = Number(dateTimeStringArray[index])
            break;
          // 12-hour format of an hour (01 through 12) with padding
          case 'KK':
          case 'hh':
            dateTime.hours = Number(dateTimeStringArray[index])
            break;
          // 24-hour format of an hour (0 through 23)
          case 'k':
          case 'H':
            dateTime.hours = Number(dateTimeStringArray[index])
            break;
          // 24-hour format of an hour (00 through 23) with padding
          case 'kk':
          case 'HH':
            dateTime.hours = Number(dateTimeStringArray[index])
            break;
          // Minutes
          case 'm':
            value = dateTime.getMinutes().toString();
            break;
          case 'mm':
            value = dateTime.getMinutes().toString().padStart(NUMBER_2, '0');
            break;
          // Seconds
          case 's':
            value = dateTime.getSeconds().toString();
            break;
          case 'ss':
            value = dateTime.getSeconds().toString().padStart(NUMBER_2, '0');
            break;
          // Milliseconds (0 - 999)
          case 'S':
            value = dateTime.getMilliseconds().toString();
            break;
          case 'SS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_2, '0');
            break;
          case 'SSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_3, '0');
            break;
          case 'SSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_4, '0');
            break;
          case 'SSSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_5, '0');
            break;
          case 'SSSSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_6, '0');
            break;
          case 'SSSSSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_7, '0');
            break;
          case 'SSSSSSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_8, '0');
            break;
          case 'SSSSSSSSS':
            value = dateTime.getMilliseconds().toString().padStart(NUMBER_9, '0');
            break;
          case 'n':
            value = dateTime.nanoSeconds.toString();
            break;
          case 'a':
            value = dateTime.meridiem();
            break;
          case 'q':
          case 'Q':
            value = this._getQuarterOfYear(dateTime).toString();
            break;
          case 'D':
            value = this._dayOfYear(dateTime).toString();
            break;
          case 'DD':
            value = this._dayOfYear(dateTime).toString().padStart(NUMBER_2, '0');
            break;
          case 'DDD':
            value = this._dayOfYear(dateTime).toString().padStart(NUMBER_3, '0');
            break;
          case 'G':
          case 'GG':
          case 'GGG':
            value = 'AD';
            break;
          case 'GGGG':
            value = 'Anno Domini';
            break;
          case 'GGGGG':
            value = 'A';
            break;
          case 'w':
            value = this._weekNumber(dateTime).toString();
            break;
          case 'ww':
            value = this._weekNumber(dateTime).toString().padStart(NUMBER_2, '0');
            break;
          case 'W':
            value = this._getWeek(dateTime).toString();
            break;
          case 'E':
          case 'EE':
          case 'EEE':
          case 'eee':
          case 'ccc':
            value = this._dayOfWeek(dateTime.weekDay + 1, true);
            break;
          case 'EEEE':
          case 'eeee':
          case 'cccc':
            value = this._dayOfWeek(dateTime.weekDay + 1, false);
            break;
          case 'EEEEE':
          case 'eeeee':
          case 'ccccc':
            value = this._dayOfWeek(dateTime.weekDay + 1, false).substring(0, 1);
            break;
          case 'e':
            value = (dateTime.weekDay + 1).toString();
            break;
          case 'ee':
            value = (dateTime.weekDay + 1).toString().padStart(NUMBER_2, '0');
            break;
          case 'eee':
            value = this._dayOfWeek(dateTime.weekDay + 1, true);
            break;
          case 'Z':
          case 'ZZ':
          case 'ZZZ':
            value = dateTime.toTimeString().slice(NUMBER_12, NUMBER_17);
            break;
          case 'ZZZZ':
            value = dateTime.toTimeString().slice(NUMBER_9, NUMBER_12);
            break;
          case 'ZZZZZ':
            value = 'Z'
            break;
          case 'P':
            value = this._suffixOfDay(dateTime.getDate())
            break;
          case '\'':
            nextCharacterIsEscaped = prevHoldValue === notation ? false : true;
            prevHoldValue = prevHoldValue === notation ? '' : notation;
            value = '';
            break;
          default:
            value = notation;
            assert(value === dateTimeStringArray[index], `Unable to parse index ${index} where format is '${value}' but dateTime passed as '${dateTimeStringArray[index]}'`);
        }
        formattedDateTime += value ?? notation;
      }
    });
    log.debug(formattedDateTime);
    return dateTime;
  }

}


// tslint:disable-next-line: max-classes-per-file
class DateTimeFormatPattern {
  private _pattern: string;
  private constructor() {
    this._pattern = '';
  }

  static build(): DateTimeFormatPattern {
    return new DateTimeFormatPattern();
  }

  convert(dateTimeFormat: DateTimeFormat): DateTimeFormatPattern {
    this._pattern = dateTimeFormat.pattern;

    return this;
  }

  get pattern(): string {
    return this._pattern;
  }

  isAmPmInFormat(): boolean {
    return this._pattern.indexOf('a') !== -1;
  }
}
