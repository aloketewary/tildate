/**
 * Date Format Error
 * @internal
 */
export class DateTimeFormatError extends Error {
    constructor(message: string, error?: Error) {
        super(`${message} Stack ${error?.stack ?? ''}`);
        this.name = 'DateTimeFormatError';
        Object.setPrototypeOf(this, DateTimeFormatError.prototype)
    }
}
