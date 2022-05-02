import { DateTime } from "../datetime";
import { assert } from "../error/assert.error";
import { NUMBER_0, NUMBER_1, NUMBER_10, NUMBER_100, NUMBER_11, NUMBER_12, NUMBER_2, NUMBER_21, NUMBER_22, NUMBER_23, NUMBER_28, NUMBER_29, NUMBER_3, NUMBER_30, NUMBER_31, NUMBER_4, NUMBER_400, NUMBER_5, NUMBER_6, NUMBER_7, NUMBER_8, NUMBER_9 } from "../util/datetime.constant";

/// Returns the day of the year starting from 0.
export function _dayOfYear(dateTime: DateTime): number {
  let dayOfYear = dateTime.date;
  const month = dateTime.month;
  const year = dateTime.year;
  for (let i = NUMBER_1; i < month; i++) {
    dayOfYear += _daysInMonth(i, year);
  }

  return dayOfYear;
}

/**
 * Returns Quarter of the year
 * @param dateTime DatetTime
 * @returns number
 */
export function _getQuarterOfYear(dateTime: DateTime): number {
  const month = dateTime.month;

  return (Math.ceil(month / NUMBER_3));
}

/// Returns the name of the day of the week, abbreviated if [abbr] is `true`.
///
/// [dayOfWeek] must be in the range of `1-7`.
///
/// The week starts from Monday.
export function _dayOfWeek(dayOfWeek: number, abbr: boolean) {
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
  }

  return nameOfDay;
}

/// Returns the suffix (`st`, `nd`, `rd`, or `th`) of [day].
export function _suffixOfDay(day: number): string {
  if (day === NUMBER_1 || day === NUMBER_21 || day === NUMBER_31) {
    return 'st';
  } else if (day === NUMBER_2 || day === NUMBER_22) {
    return 'nd';
  } else if (day === NUMBER_3 || day === NUMBER_23) {
    return 'rd';
  }

  return 'th';
}

export function _weekNumber(dateTime: DateTime): number {
  const numberOfDays = _dayOfYear(dateTime);

  return Math.ceil(((dateTime.getDay() + numberOfDays) / NUMBER_7) + NUMBER_1);
}


export function _getWeek(date: DateTime): number {
  const monthStart = new Date(date);
  monthStart.setDate(NUMBER_0);
  const offset = (monthStart.getDay()) % NUMBER_7; // -1 is for a week starting on Monday

  return Math.ceil((date.getDate() + offset) / NUMBER_7);
}

  /// Returns the number of days in [month].
  export function _daysInMonth(month: number, year: number): number {
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
    export function _isLeapYear(year: number): boolean {
      // tslint:disable-next-line: no-magic-numbers
      return year % NUMBER_100 === NUMBER_0 ? year % NUMBER_400 === NUMBER_0 : year % NUMBER_4 === NUMBER_0;
    }
