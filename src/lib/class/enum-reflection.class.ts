export class EnumReflection<T> {
  private readonly names: any = {};
  private readonly _object: T;

  public constructor(object: T) {
    this._object = object;
    for (const name in object) {
      const value = object[name];
      this.names[value] = name;
    }
  }

  public getName(value: string | number): string {
    return this.names[value] || null;
  }

  public getKey(value: string | number): any {
    return (
      Object.keys(this._object)[
        Object.values(this._object).indexOf(value as unknown as T)
      ] || null
    );
  }
}
