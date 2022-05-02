import { _isLeapYear } from "./common/datetime.shared";
import { FromTo } from "./common/from-to.model";
import { DateTimeFormat } from "./formatter/datetime.format";
import { DateTimeFormatter } from "./formatter/datetime.formatter";
import { NUMBER_10, NUMBER_1000, NUMBER_12, NUMBER_23, NUMBER_24, NUMBER_59, NUMBER_6, NUMBER_60, NUMBER_7, NUMBER_999 } from "./util/datetime.constant";
import { UnitOfDateTime, WeekDay } from "./util/unit-of-datetime.type";

/**
 * It is having the same functionality as native JS Date with some additional methods
 */
export class DateTime extends Date {
  /**
   * Used with Intl.DateTimeFormat
   * @type {string}
   */
  private locale = "default";

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
   * @param {Date} date
   * @returns {DateTime}
   */
  static convert(date: Date): DateTime {
    if (!date) throw new Error(`A date is required`);
    // if (typeof date.startOf === 'function') return date;
    // tslint:disable-next-line: strict-type-predicates
    if (typeof date.getDate !== 'function') throw new Error(`A date is required`);

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
    return this.date < NUMBER_10 ? `0${this.date}` : `${this.date}`;
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
      startOfYear.getDate() + (firstDayOfWeek - (startOfYear.getDay() % NUMBER_7))
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
    return this.month + 1 < NUMBER_10 ? `0${this.month}` : `${this.month}`;
  }

  /**
  * Get the meridiem of the date. E.g. AM or PM.
  * If the {@link locale} provides a "dayPeriod" then this will be returned,
  * otherwise it will return AM or PM.
  * @param locale
  * @returns {string}
  */
  meridiem(locale: string = this.locale): string {
    console.debug(locale);
    return this.getHours() <= NUMBER_12 ? "AM" : "PM";
  }

  /**
   * Sets the current date to the start of the {@link unit} provided
   * Example: Consider a date of "April 30, 2021, 11:45:32.984 AM" => new DateTime(2021, 3, 30, 11, 45, 32, 984).startOf('month')
   * would return April 1, 2021, 12:00:00.000 AM (midnight)
   * @param { UnitOfDateTime } unit
   * @param startOfTheWeek Allows for the changing the start of the week.
   * @returns {DateTime} self
   */
  startOf(unit: UnitOfDateTime | WeekDay, startOfTheWeek = 0): DateTime {
    // tslint:disable-next-line: strict-type-predicates
    if (unit === undefined) throw new Error(`Unit '${unit}' is not valid`);
    switch (unit) {
      case 'seconds':
        this.setMilliseconds(0);
        break;
      case 'minutes':
        this.setSeconds(0, 0);
        break;
      case 'hours':
        this.setMinutes(0, 0, 0);
        break;
      case 'date':
        this.setHours(0, 0, 0, 0);
        break;
      case 'weekDay':
        this.startOf('date');
        this.manipulate(startOfTheWeek - this.weekDay, 'date');
        break;
      case 'month':
        this.startOf('date');
        this.setDate(1);
        break;
      case 'year':
        this.startOf('date');
        this.setMonth(0, 1);
        break;
      default:
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
  endOf(unit: UnitOfDateTime | WeekDay): DateTime {
    // tslint:disable-next-line: strict-type-predicates
    if (unit == null) throw new Error(`Unit '${unit}' is not valid`);
    switch (unit) {
      case 'seconds':
        this.setMilliseconds(NUMBER_999);
        break;
      case 'minutes':
        this.setSeconds(NUMBER_59, NUMBER_999);
        break;
      case 'hours':
        this.setMinutes(NUMBER_59, NUMBER_59, NUMBER_999);
        break;
      case 'date':
        this.setHours(NUMBER_23, NUMBER_59, NUMBER_59, NUMBER_999);
        break;
      case 'weekDay':
        this.startOf('date');
        this.manipulate(NUMBER_6 - this.weekDay, 'date');
        break;
      case 'month':
        this.endOf('date');
        this.manipulate(1, 'month');
        this.setDate(0);
        break;
      case 'year':
        this.endOf('date');
        this.manipulate(1, 'year');
        this.setDate(0);
        break;
      default: break;
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
  private manipulate(value: number, unit: UnitOfDateTime): DateTime {
    // tslint:disable-next-line: strict-type-predicates
    if (unit === undefined) throw new Error(`Unit '${unit}' is not valid`);
    this[unit] += value;

    return this;
  }

  /**
   * Return true if {@link compare} is before this date
   * @param {DateTime} compare The Date/DateTime to compare
   * @param {UnitOfDateTime?} unit. If provided, uses {@link startOf} for comparison.
   * @returns {boolean}
   */
  isBefore(compare: DateTime, unit?: UnitOfDateTime): boolean {
    if (!unit) return this < compare;
    // tslint:disable-next-line: strict-type-predicates
    if (this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
    // tslint:disable-next-line: no-parameter-reassignment
    compare = DateTime.convert(compare);

    return (
      this.clone.startOf(unit).valueOf() < compare.clone.startOf(unit).valueOf()
    );
  }

  /**
   * Return true if {@link compare} is after this date
   * @param {DateTime} compare The Date/DateTime to compare
   * @param {UnitOfDateTime?} unit. If provided, uses {@link startOf} for comparison.
   * @returns {boolean}
   */
  isAfter(compare: DateTime, unit?: UnitOfDateTime): boolean {
    if (!unit) return this > compare;
    // tslint:disable-next-line: strict-type-predicates
    if (this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
    // tslint:disable-next-line: no-parameter-reassignment
    compare = DateTime.convert(compare);

    return (
      this.clone.startOf(unit).valueOf() > compare.clone.startOf(unit).valueOf()
    );
  }

  /**
   * Return true if {@link compare} is same this date
   * @param {DateTime} compare The Date/DateTime to compare
   * @param {UnitOfDateTime?} unit. If provided, uses {@link startOf} for comparison.
   * @returns {boolean}
   */
  isSame(compare: DateTime, unit?: UnitOfDateTime): boolean {
    if (!unit) return this.valueOf() === compare.valueOf();
    // tslint:disable-next-line: strict-type-predicates
    if (this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
    // tslint:disable-next-line: no-parameter-reassignment
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
   * @param {string} inclusively. A [ indicates inclusion of a value. A ( indicates exclusion.
   * If the inclusively parameter is used, both indicators must be passed.
   * @returns {boolean}
   */
  isBetween(left: DateTime, right: DateTime, unit: UnitOfDateTime, inclusively = "()"): boolean {
    // tslint:disable-next-line: strict-type-predicates
    if (this[unit] === undefined) throw new Error(`Unit '${unit}' is not valid`);
    const leftInclusively = inclusively[0] === "(";
    const rightInclusively = inclusively[1] === ")";
    // tslint:disable-next-line: no-parameter-reassignment
    left = DateTime.convert(left);
    // tslint:disable-next-line: no-parameter-reassignment
    right = DateTime.convert(right);

    return (
      ((leftInclusively
        ? this.isAfter(left, unit)
        : !this.isBefore(left, unit)) &&
        (rightInclusively
          ? this.isBefore(right, unit)
          : !this.isAfter(right, unit))) ||
      ((leftInclusively
        ? this.isBefore(left, unit)
        : !this.isAfter(left, unit)) &&
        (rightInclusively
          ? this.isAfter(right, unit)
          : !this.isBefore(right, unit)))
    );
  }

  // workaround as js doesn't support nanoseconds in its layer
  get nanoSeconds(): number {
    // tslint:disable-next-line: no-magic-numbers
    return Math.round(this.getTime() * NUMBER_1000);
  }

  millisecondsSinceEpoch(): number {

    return Math.round(this.getTime());
  }

  secondsSinceEpoch(): number {

    return Math.round(this.millisecondsSinceEpoch() / NUMBER_1000);
  }

   /**
    * Returns `true` if [year] is a leap year, otherwise returns `false`.
    */
  isLeapYear(): boolean {

    return _isLeapYear(this.year);
  }

  /**
   */
  get weekNumber(): number {
    const oneJan = new DateTime(this.getFullYear(), 0, 1);
    const numberOfDays = Math.floor((this.getTime() - oneJan.getTime()) / (NUMBER_24 * NUMBER_60 * NUMBER_60 * NUMBER_1000));

    return Math.ceil((this.getDay() + 1 + numberOfDays) / NUMBER_7);
  }

  format(pattern: DateTimeFormat | string): string {
    return DateTimeFormatter.init.ofPattern(pattern).format(this);
  }

  parse(dateTimeInString: string): DateTime {
    const dateTimeFormatter = new DateTimeFormat().of("yyyy-MM-dd'T'hh:mm:ss.SS");
    return DateTimeFormatter.init.ofPattern(dateTimeFormatter).parse(dateTimeInString);
  }

  /**
   * Return Rolling DateTime as From and To
   * @param pattern Pattern in {DateTimeFrom |string}
   * @returns FromTo object
   */
  rolling12Month(pattern: string | DateTimeFormat = 'yyyy-MM-dd'): FromTo {
    const from = new DateTime();
    const to = from.clone;
    to.date = to.date - (to.isLeapYear() ? 366 : 365);
    return new FromTo(from.format(pattern), to.format(pattern));
  }
}
