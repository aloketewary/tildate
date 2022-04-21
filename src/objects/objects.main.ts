
export class Objects {

    static requireNonNull(obj?: object, message?: string): object {
        if (obj === undefined) {
            throw new Error(message);
        }

        return obj;
    }

}
