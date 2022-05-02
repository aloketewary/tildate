import { DateTime } from "../datetime";

export class FromTo {
  from: string;
  to: string;
  constructor(from: string, to: string) {
    this.from = from;
    this.to = to;
  }
}

export class FromToAsDateTime {
  from: DateTime;
  to: DateTime;
  constructor(from: DateTime, to: DateTime) {
    this.from = from;
    this.to = to;
  }
}
