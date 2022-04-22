export class EnumReflection<T> {
    // tslint:disable-next-line: no-any
    private names : any = { };
    private _object: T;

    constructor(object : T) {
        this._object = object;
        // tslint:disable-next-line: forin
        for(const name in object) {
            const value = object[name];
            // tslint:disable-next-line: no-unsafe-any
            this.names[value] = name;
        }
    }

    getName(value : string | number) : string {
        // tslint:disable-next-line: no-unsafe-any
        return this.names[value] || null;
    }

    // tslint:disable-next-line: no-any
    getKey(value : string | number) : any {
        return Object.keys(this._object)[Object.values(this._object).indexOf(value as unknown as T)]|| null;
    }
}
