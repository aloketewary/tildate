import { _dayOfWeek, _dayOfYear, _getQuarterOfYear, _getWeek, _suffixOfDay, _weekNumber } from "../common/datetime.shared";
import { DateTime } from "../datetime";
import { assert } from "../error/assert.error";
import { DateTimeFormatError } from "../error/date-format.error";
import { DateTimeFormatPattern } from "../formatter/datetime-format.pattern";
import { DateTimeFormat } from "../formatter/datetime.format";
import { NUMBER_0, NUMBER_1, NUMBER_MIN_1, NUMBER_2, NUMBER_3, NUMBER_4, NUMBER_5, NUMBER_6, NUMBER_7, NUMBER_8, NUMBER_9, NUMBER_10, NUMBER_11 } from "../util/datetime.constant";

export class DateTimeParserBuilder {
  private _currentPattern: DateTimeFormatPattern = DateTimeFormatPattern.build();
  private monthList = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  constructor() {
    Object.setPrototypeOf(this, DateTimeParserBuilder.prototype);
  }

  appendPattern(pattern: DateTimeFormat): DateTimeParserBuilder {
    assert(pattern != null, 'Pattern found as null');
    this._currentPattern = DateTimeFormatPattern.build().convert(pattern);

    return this;
  }

  static build(): DateTimeParserBuilder {
    return new DateTimeParserBuilder();
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

  private _parse(dateTimeInString: string, format: DateTimeFormatPattern): DateTime {
    let isAm = false;
    let isPm = false;
    if (format.isAmPmInFormat()) {
      isAm = dateTimeInString.indexOf('am') !== -1;
      isPm = dateTimeInString.indexOf('pm') !== -1;
      assert(isAm || isPm, 'AM or PM text not found')
      dateTimeInString = dateTimeInString.replace(isAm ? 'am' : 'pm', isAm ? 'R' : 'B');
    }
    const pattern = format.pattern;
    assert(pattern.length === dateTimeInString.length, 'format and actual data input length mismatch!')
    let dateTime = new DateTime();
    let formattedDateTime = '';
    let nextCharacterIsEscaped = false;
    let prevHoldValue = '';
    let startIndex: number = 0;
    let endIndex: number = 0;
    const formatArray = pattern.match(/(.)(?=\1)\1+|(.)(?!\2)/g) ?? [];
    let dateTimeStringArray: Array<string> = new Array<string>();
    formatArray.map(value => {
        endIndex += (value.length);
        dateTimeStringArray.push(dateTimeInString.substring(startIndex, endIndex));
        startIndex += value.length;
    });
    assert(formatArray.length === dateTimeStringArray.length, 'format and actual data length mismatch!')
    formatArray.forEach((notation, index) => {
        let value: string = '';
        if (nextCharacterIsEscaped && (prevHoldValue !== '' && prevHoldValue !== notation)) {
            formattedDateTime += notation;
        } else {
            switch (notation) {
                case 'd':
                    dateTime.date = parseInt(dateTimeStringArray[index]);
                    break;
                case 'dd':
                    dateTime.date = parseInt(dateTimeStringArray[index].padStart(2, '0'));
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
                    dateTime.year = parseInt(dateTimeStringArray[index]);
                    break;
                case 'uu':
                case 'YY':
                case 'yy':
                    const yearPadding = dateTime.year.toString().substring(0,2);
                    dateTime.year = parseInt(`${yearPadding}${dateTimeStringArray[index]}`);
                    break;
                case 'L':
                case 'M':
                    dateTime.month  = parseInt(dateTimeStringArray[index]) - 1;
                    break;
                case 'LL':
                case 'MM':
                    dateTime.month  = parseInt(dateTimeStringArray[index].padStart(2, '0')) - 1;
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
                    dateTime.hours = parseInt(dateTimeStringArray[index])
                    break;
                // 12-hour format of an hour (01 through 12) with padding
                case 'KK':
                case 'hh':
                    dateTime.hours = parseInt(dateTimeStringArray[index])
                    break;
                // 24-hour format of an hour (0 through 23)
                case 'k':
                case 'H':
                    dateTime.hours = parseInt(dateTimeStringArray[index])
                    break;
                // 24-hour format of an hour (00 through 23) with padding
                case 'kk':
                case 'HH':
                    dateTime.hours = parseInt(dateTimeStringArray[index])
                    break;
                // Minutes
                case 'm':
                    dateTime.minutes = parseInt(dateTimeStringArray[index].padStart(2, '0'));
                    break;
                case 'mm':
                    dateTime.minutes = parseInt(dateTimeStringArray[index]);
                    break;
                // Seconds
                case 's':
                    dateTime.seconds = parseInt(dateTimeStringArray[index].padStart(2, '0'));
                    break;
                case 'ss':
                    dateTime.seconds = parseInt(dateTimeStringArray[index]);
                    break;
                // Milliseconds (0 - 999)
                case 'S':
                    dateTime.setMilliseconds(parseInt(dateTimeStringArray[index].padStart(3, '0')));
                    break;
                case 'SS':
                    dateTime.setMilliseconds(parseInt(dateTimeStringArray[index].padStart(2, '0')));
                    break;
                case 'SSS':
                    dateTime.setMilliseconds(parseInt(dateTimeStringArray[index]));
                    break;
                case 'SSSS':
                case 'SSSSS':
                case 'SSSSSS':
                case 'SSSSSSS':
                case 'SSSSSSSS':
                case 'SSSSSSSSS':
                    dateTime.setMilliseconds(parseInt(dateTimeStringArray[index].substring(0, 2)));
                    break;
                case 'n':
                    dateTime = new DateTime(parseInt(dateTimeStringArray[index]));
                    break;
                case 'a':
                    value = dateTime.meridiem();
                    break;
                case 'q':
                case 'Q':
                    value = _getQuarterOfYear(dateTime).toString();
                    break;
                case 'D':
                    value = _dayOfYear(dateTime).toString();
                    break;
                case 'DD':
                    value = _dayOfYear(dateTime).toString().padStart(2, '0');
                    break;
                case 'DDD':
                    value = _dayOfYear(dateTime).toString().padStart(3, '0');
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
                    value = _weekNumber(dateTime).toString();
                    break;
                case 'ww':
                    value = _weekNumber(dateTime).toString().padStart(2, '0');
                    break;
                case 'W':
                    value = _getWeek(dateTime).toString();
                    break;
                case 'E':
                case 'EE':
                case 'EEE':
                case 'eee':
                case 'ccc':
                    value = _dayOfWeek(dateTime.weekDay + 1, true);
                    break;
                case 'EEEE':
                case 'eeee':
                case 'cccc':
                    value = _dayOfWeek(dateTime.weekDay + 1, false);
                    break;
                case 'EEEEE':
                case 'eeeee':
                case 'ccccc':
                    value = _dayOfWeek(dateTime.weekDay + 1, false).substring(0, 1);
                    break;
                case 'e':
                    value = (dateTime.weekDay + 1).toString();
                    break;
                case 'ee':
                    value = (dateTime.weekDay + 1).toString().padStart(2, '0');
                    break;
                case 'eee':
                    value = _dayOfWeek(dateTime.weekDay + 1, true);
                    break;
                case 'Z':
                case 'ZZ':
                case 'ZZZ':
                    value = dateTime.toTimeString().slice(12, 17);
                    break;
                case 'ZZZZ':
                    value = dateTime.toTimeString().slice(9, 12);
                    break;
                case 'ZZZZZ':
                    value = 'Z'
                    break;
                case 'P':
                    value = _suffixOfDay(dateTime.getDate())
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
    console.log(formattedDateTime);
    return dateTime;
}

}
