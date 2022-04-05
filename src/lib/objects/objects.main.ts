export class Objects {
  static requireNonNull(obj: unknown, message: string) {
    return obj == null ? new Error(message) : obj;
  }
}
