export class DateTimeFormatError extends Error {
    constructor(message: string, error?: Error) {
        super(`${message} Stack ${error?.stack ?? ''}`);
        Object.setPrototypeOf(this, DateTimeFormatError.prototype)
    }
}