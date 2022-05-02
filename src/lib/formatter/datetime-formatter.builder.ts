import { _dayOfWeek, _dayOfYear, _getQuarterOfYear, _getWeek, _suffixOfDay, _weekNumber } from "../common/datetime.shared";
import { DateTime } from "../datetime";
import { assert } from "../error/assert.error";
import { NUMBER_0, NUMBER_1, NUMBER_10, NUMBER_11, NUMBER_12, NUMBER_17, NUMBER_2, NUMBER_3, NUMBER_4, NUMBER_5, NUMBER_6, NUMBER_7, NUMBER_8, NUMBER_9 } from "../util/datetime.constant";
import { DateTimeFormatPattern } from "./datetime-format.pattern";
import { DateTimeFormat } from "./datetime.format";

export class DateTimeFormatterBuilder {
  private _currentPattern: DateTimeFormatPattern = DateTimeFormatPattern.build();

  private constructor() {
    Object.setPrototypeOf(this, DateTimeFormatterBuilder.prototype);
  }

  appendPattern(pattern: DateTimeFormat): DateTimeFormatterBuilder {
    assert(pattern != null, 'Pattern found as null');
    this._currentPattern = DateTimeFormatPattern.build().convert(pattern);

    return this;
  }

  static build(): DateTimeFormatterBuilder {
    return new DateTimeFormatterBuilder();
  }

  format(dateTime: DateTime): string {
    return this._format(dateTime, this._currentPattern.pattern);
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
            value = this._month(dateTime.month, true);
            break;
          case 'LLLL':
          case 'MMMM':
            value = this._month(dateTime.month, false);
            break;
          case 'LLLLL':
          case 'MMMMM':
            value = this._month(dateTime.month, false).substring(0, 1);
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
            value = _getQuarterOfYear(dateTime).toString();
            break;
          case 'D':
            value = _dayOfYear(dateTime).toString();
            break;
          case 'DD':
            value = _dayOfYear(dateTime).toString().padStart(NUMBER_2, '0');
            break;
          case 'DDD':
            value = _dayOfYear(dateTime).toString().padStart(NUMBER_3, '0');
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
            value = _weekNumber(dateTime).toString().padStart(NUMBER_2, '0');
            break;
          case 'W':
            value = _getWeek(dateTime).toString();
            break;
          case 'E':
          case 'EE':
          case 'EEE':
          case 'eee':
          case 'ccc':
            value = _dayOfWeek(dateTime.weekDay - NUMBER_1, true);
            break;
          case 'EEEE':
          case 'eeee':
          case 'cccc':
            value = _dayOfWeek(dateTime.weekDay - NUMBER_1, false);
            break;
          case 'EEEEE':
          case 'eeeee':
          case 'ccccc':
            value = _dayOfWeek(dateTime.weekDay - NUMBER_1, false).substring(NUMBER_0, NUMBER_1);
            break;
          case 'e':
            value = (dateTime.weekDay - NUMBER_1).toString();
            break;
          case 'ee':
            value = (dateTime.weekDay - NUMBER_1).toString().padStart(NUMBER_2, '0');
            break;
          case 'eee':
            value = _dayOfWeek(dateTime.weekDay - NUMBER_1, true);
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
            value = _suffixOfDay(dateTime.getDate())
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
  /// [month] must be in the range of `0-11`.
  private _month(month: number, abbr: boolean): string {
    assert(month >= NUMBER_0 && month <= NUMBER_11);
    let nameOfMonth = '';
    switch (month) {
      case NUMBER_0:
        nameOfMonth = abbr ? 'Jan' : 'January';
        break;
      case NUMBER_1:
        nameOfMonth = abbr ? 'Feb' : 'February';
        break;
      case NUMBER_2:
        nameOfMonth = abbr ? 'Mar' : 'March';
        break;
      case NUMBER_3:
        nameOfMonth = abbr ? 'Apr' : 'April';
        break;
      case NUMBER_4:
        nameOfMonth = 'May';
        break;
      case NUMBER_5:
        nameOfMonth = abbr ? 'Jun' : 'June';
        break;
      case NUMBER_6:
        nameOfMonth = abbr ? 'Jul' : 'July';
        break;
      case NUMBER_7:
        nameOfMonth = abbr ? 'Aug' : 'August';
        break;
      case NUMBER_8:
        nameOfMonth = abbr ? 'Sep' : 'September';
        break;
      case NUMBER_9:
        nameOfMonth = abbr ? 'Oct' : 'October';
        break;
      case NUMBER_10:
        nameOfMonth = abbr ? 'Nov' : 'November';
        break;
      case NUMBER_11:
        nameOfMonth = abbr ? 'Dec' : 'December';
        break;
      default:
        break;
    }

    return nameOfMonth;
  }

}


