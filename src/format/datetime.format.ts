
export class DateTimeFormat {
    private _pattern: string;

    constructor() {
        this._pattern = '';
    }

   /**
    * 2019-11-05T19:42:05-08:00
    * yyyy-MM-ddTHH:mm:ss-z
    */
    static ISO_8601 = "yyyy-MM-dd'T'HH:mm:ss-z'";

    get pattern(): string {
        return this._pattern;
    }

    of(pattern: string): DateTimeFormat {
        this._pattern = pattern;
        
        return this;
    }
}
