export class EnumReflection<T> {
    private names : any = { };
    private _object: T;

    public constructor(object : T) {
        this._object = object;
        for(let name in object) {
            let value = object[name];
            this.names[value] = name;
        }
    }

    public getName(value : string | number) : string {
        return this.names[value] || null;
    }

    public getKey(value : string | number) : any {
        return Object.keys(this._object)[Object.values(this._object).indexOf(value as unknown as T)]|| null;
    }
}