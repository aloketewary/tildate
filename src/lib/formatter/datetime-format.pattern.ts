import { DateTimeFormat } from "./datetime.format";

export class DateTimeFormatPattern {
  private _pattern: string;
  private constructor() {
    this._pattern = '';
    Object.setPrototypeOf(this, DateTimeFormatPattern.prototype);
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
