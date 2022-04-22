import { EnumReflection } from './class/enum-reflection.class';
import { UnitOfDateTime } from './enum/unit.enum';
import { DateTimeFormat } from './format/datetime.format';
import { DateTimeFormatter } from './format/datetime.formatter';

/**
 * For the most part this object behaves exactly the same way
 * as the native Date object with a little extra spice.
 */
export class DateTime extends Date {
  private readonly unitOfDateTime = new EnumReflection(UnitOfDateTime);

  /**
   * Used with Intl.DateTimeFormat
   * @type {string}
   */
  private locale: string = 'default';

  /**
   * Chainable way to set the {@link locale}
   * @param value
   * @returns {DateTime}
   */
  setLocale(value: string): DateTime {
    this.locale = value;
    return this;
  }

  /**
   * Converts a plain JS date object to a DateTime object.
   * Doing this allows access to format, etc.
   * @param {Date|DateTime} date
   * @returns {DateTime}
   */
  static convert(date: Date): DateTime {
    if (!date) throw `A date is required`;
    // if (typeof date.startOf === 'function') return date;
    if (typeof date.getDate !== 'function') throw `A date is required`;
    return new DateTime(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
      date.getMilliseconds()
    );
  }

  /**
   * Native date manipulations are not pure functions. This function creates a duplicate of the DateTime object.
   * @returns {DateTime}
   */
  get clone(): DateTime {
    return new DateTime(
      this.year,
      this.month,
      this.date,
      this.hours,
      this.minutes,
      this.seconds,
      this.getMilliseconds()
    ).setLocale(this.locale);
  }

  /**
   * Shortcut to Date.getSeconds()
   * @returns {number}
   */
  get seconds(): number {
    return this.getSeconds();
  }

  /**
   * Shortcut to Date.setSeconds()
   */
  set seconds(value: number) {
    this.setSeconds(value);
  }

  /**
   * Shortcut to Date.getMinutes()
   * @returns {number}
   */
  get minutes(): number {
    return this.getMinutes();
  }

  /**
   * Shortcut to Date.setMinutes()
   */
  set minutes(value: number) {
    this.setMinutes(value);
  }

  /**
   * Shortcut to Date.getHours()
   * @returns {number}
   */
  get hours(): number {
    return this.getHours();
  }

  /**
   * Shortcut to Date.setHours()
   */
  set hours(value: number) {
    this.setHours(value);
  }

  /**
   * Shortcut to Date.getDate()
   * @returns {number}
   */
  get date(): number {
    return this.getDate();
  }

  /**
   * Shortcut to Date.setDate()
   */
  set date(value: number) {
    this.setDate(value);
  }

  /**
   * Return two digit date
   * @returns {string}
   */
  get dateFormatted(): string {
    return this.date < 10 ? `0${this.date}` : `${this.date}`;
  }

  // https://github.com/you-dont-need/You-Dont-Need-Momentjs#week-of-year
  /**
   * Gets the week of the year
   * @returns {number}
   */
  get week(): number {
    const MILLISECONDS_IN_WEEK = 604800000;
    const firstDayOfWeek = 1; // monday as the first day (0 = sunday)
    const startOfYear = new Date(this.year, 0, 1);
    startOfYear.setDate(
      startOfYear.getDate() + (firstDayOfWeek - (startOfYear.getDay() % 7))
    );
    return (
      Math.round(
        (this.valueOf() - startOfYear.valueOf()) / MILLISECONDS_IN_WEEK
      ) + 1
    );
  }

  /**
   * Shortcut to Date.getDay()
   * @returns {number}
   */
  get weekDay(): number {
    return this.getDay();
  }

  /**
   * Shortcut to Date.getMonth()
   * @returns {number}
   */
  get month(): number {
    return this.getMonth();
  }

  /**
   * Shortcut to Date.setMonth()
   */
  set month(value: number) {
    this.setMonth(value);
  }

  /**
   * Shortcut to Date.getFullYear()
   * @returns {number}
   */
  get year(): number {
    return this.getFullYear();
  }

  /**
   * Shortcut to Date.setFullYear()
   */
  set year(value: number) {
    this.setFullYear(value);
  }

  /**
   * Return two digit, human expected month. E.g. January = 1, December = 12
   * @returns {string}
   */
  get monthFormatted(): string {
    return this.month + 1 < 10 ? `0${this.month}` : `${this.month}`;
  }

  /**
   * Get the meridiem of the date. E.g. AM or PM.
   * If the {@link locale} provides a "dayPeriod" then this will be returned,
   * otherwise it will return AM or PM.
   * @param locale
   * @returns {string}
   */
  meridiem(locale: string = this.locale): string {
    console.log(locale);
    return this.getHours() <= 12 ? 'AM' : 'PM';
  }

  /**
   * Sets the current date to the start of the {@link unit} provided
   * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).startOf('month')
   * would return April 1, 2021, 12:00:00.000 AM (midnight)
   * @param { UnitOfDateTime } unit
   * @param startOfTheWeek Allows for the changing the start of the week.
   * @returns {DateTime} self
   */
  startOf(unit: UnitOfDateTime, startOfTheWeek = 0): DateTime {
    if (this.unitOfDateTime.getName(unit) === undefined)
      throw `Unit '${unit}' is not valid`;
    switch (unit) {
      case UnitOfDateTime.SECONDS:
        this.setMilliseconds(0);
        break;
      case UnitOfDateTime.MINUTES:
        this.setSeconds(0, 0);
        break;
      case UnitOfDateTime.HOURS:
        this.setMinutes(0, 0, 0);
        break;
      case UnitOfDateTime.DATE:
        this.setHours(0, 0, 0, 0);
        break;
      case UnitOfDateTime.WEEKDAY:
        this.startOf(UnitOfDateTime.DATE);
        this.manipulate(startOfTheWeek - this.weekDay, UnitOfDateTime.DATE);
        break;
      case UnitOfDateTime.MONTH:
        this.startOf(UnitOfDateTime.DATE);
        this.setDate(1);
        break;
      case UnitOfDateTime.YEAR:
        this.startOf(UnitOfDateTime.DATE);
        this.setMonth(0, 1);
        break;
    }
    return this;
  }

  /**
   * Sets the current date to the end of the {@link unit} provided
   * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).endOf('month')
   * would return April 30, 2021, 11:59:59.999 PM
   * @param {UnitOfDateTime} unit
   * @returns {DateTime} self
   */
  endOf(unit: UnitOfDateTime): DateTime {
    if (this.unitOfDateTime.getName(unit) == null)
      throw `Unit '${unit}' is not valid`;
    switch (unit) {
      case UnitOfDateTime.SECONDS:
        this.setMilliseconds(999);
        break;
      case UnitOfDateTime.MINUTES:
        this.setSeconds(59, 999);
        break;
      case UnitOfDateTime.HOURS:
        this.setMinutes(59, 59, 999);
        break;
      case UnitOfDateTime.DATE:
        this.setHours(23, 59, 59, 999);
        break;
      case UnitOfDateTime.WEEKDAY:
        this.startOf(UnitOfDateTime.DATE);
        this.manipulate(6 - this.weekDay, UnitOfDateTime.DATE);
        break;
      case UnitOfDateTime.MONTH:
        this.endOf(UnitOfDateTime.DATE);
        this.manipulate(1, UnitOfDateTime.MONTH);
        this.setDate(0);
        break;
      case UnitOfDateTime.YEAR:
        this.endOf(UnitOfDateTime.DATE);
        this.manipulate(1, UnitOfDateTime.YEAR);
        this.setDate(0);
        break;
    }
    return this;
  }

  /**
   * Change a {@link unit} value. Value can be positive or negative
   * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).manipulate(1, 'month')
   * would return May 30, 2021, 11:45:32.984 AM
   * @param value A positive or negative number
   * @param {Unit} unit
   * @returns {DateTime}
   */
  manipulate(value: number, unit: UnitOfDateTime): DateTime {
    if (this.unitOfDateTime.getName(unit) === undefined)
      throw `Unit '${unit}' is not valid`;
    this[unit] += value;
    return this;
  }

  /**
   * Shortcut to Date.getDay()
   *
   */
  set weekDay(value: number) {
    throw Error(`${value} ${this.locale}`);
  }

  /**
   * Return true if {@link compare} is before this date
   * @param {DateTime} compare The Date/DateTime to compare
   * @param {UnitOfDateTime?} unit. If provided, uses {@link startOf} for
   * comparision.
   * @returns {boolean}
   */
  isBefore(compare: DateTime, unit?: UnitOfDateTime): boolean {
    if (!unit) return this < compare;
    if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
    compare = DateTime.convert(compare);
    return (
      this.clone.startOf(unit).valueOf() < compare.clone.startOf(unit).valueOf()
    );
  }

  /**
   * Return true if {@link compare} is after this date
   * @param {DateTime} compare The Date/DateTime to compare
   * @param {UnitOfDateTime?} unit. If provided, uses {@link startOf} for
   * comparision.
   * @returns {boolean}
   */
  isAfter(compare: DateTime, unit?: UnitOfDateTime): boolean {
    if (!unit) return this > compare;
    if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
    compare = DateTime.convert(compare);
    return (
      this.clone.startOf(unit).valueOf() > compare.clone.startOf(unit).valueOf()
    );
  }

  /**
   * Return true if {@link compare} is same this date
   * @param {DateTime} compare The Date/DateTime to compare
   * @param {UnitOfDateTime?} unit. If provided, uses {@link startOf} for
   * comparision.
   * @returns {boolean}
   */
  isSame(compare: DateTime, unit: UnitOfDateTime): boolean {
    if (!unit) return this.valueOf() === compare.valueOf();
    if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
    compare = DateTime.convert(compare);
    return (
      this.clone.startOf(unit).valueOf() === compare.startOf(unit).valueOf()
    );
  }

  /**
   * Check if this is between two other DateTimes, optionally looking at unit scale. The match is exclusive.
   * @param {DateTime} left
   * @param {DateTime} right
   * @param {UnitOfDateTime} unit.
   * @param {string} inclusivity. A [ indicates inclusion of a value. A ( indicates exclusion.
   * If the inclusivity parameter is used, both indicators must be passed.
   * @returns {boolean}
   */
  isBetween(
    left: DateTime,
    right: DateTime,
    unit: UnitOfDateTime,
    inclusivity = '()'
  ): boolean {
    if (this[unit] === undefined) throw `Unit '${unit}' is not valid`;
    const leftInclusivity = inclusivity[0] === '(';
    const rightInclusivity = inclusivity[1] === ')';
    left = DateTime.convert(left);
    right = DateTime.convert(right);

    return (
      ((leftInclusivity
        ? this.isAfter(left, unit)
        : !this.isBefore(left, unit)) &&
        (rightInclusivity
          ? this.isBefore(right, unit)
          : !this.isAfter(right, unit))) ||
      ((leftInclusivity
        ? this.isBefore(left, unit)
        : !this.isAfter(left, unit)) &&
        (rightInclusivity
          ? this.isAfter(right, unit)
          : !this.isBefore(right, unit)))
    );
  }

  // workaround as js doesnot support nanoseconds in its layer
  get nanoSeconds(): number {
    return Math.round(this.getTime() * 1000);
  }

  milisecondsSinceEpoch(): number {
    return Math.round(this.getTime());
  }

  secondsSinceEpoch(): number {
    return Math.round(this.milisecondsSinceEpoch() / 1000);
  }

  /// Returns `true` if [year] is a leap year, otherwise returns `false`.
  isLeapYear(year: number): boolean {
    return year % 100 == 0 ? year % 400 == 0 : year % 4 == 0;
  }

  get weekNumber(): number {
    const oneJan = new DateTime(this.getFullYear(), 0, 1);
    const numberOfDays = Math.floor(
      (this.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000)
    );
    return Math.ceil((this.getDay() + 1 + numberOfDays) / 7);
  }

  format(pattern: DateTimeFormat | string): string {
    return DateTimeFormatter.init.ofPattern(pattern).format(this);
  }
}
