import { NUMBER_10, NUMBER_12, NUMBER_7 } from "./util/datetime.constant";

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
}
