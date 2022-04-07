export class Objects {
  static requireNonNull(obj: unknown, message: string) {
    if (obj == null) throw new Error(message);
    return  obj;
  }
}
