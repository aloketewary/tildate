import { DateTime } from "../datetime";
import { DateTimeParserBuilder } from "../parser/datetime.parser";
import { DateTimeFormatterBuilder } from "./datetime-formatter.builder";
import { DateTimeFormat } from "./datetime.format";

export class DateTimeFormatter {
  private _dateTimeFormatBuilder!: DateTimeFormatterBuilder;
  private _dateTimeParserBuilder!: DateTimeParserBuilder;

  private constructor() {
    Object.setPrototypeOf(this, DateTimeFormatter.prototype);
  }

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
    this._dateTimeFormatBuilder = DateTimeFormatterBuilder.build().appendPattern(newPattern);
    this._dateTimeParserBuilder = DateTimeParserBuilder.build().appendPattern(newPattern);

    return this;
  }

  format(dateTime: DateTime): string {
    return this._dateTimeFormatBuilder.format(dateTime);
  }

  parse(dateTimeInStr: string): DateTime {
    return this._dateTimeParserBuilder.parse(dateTimeInStr);
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


