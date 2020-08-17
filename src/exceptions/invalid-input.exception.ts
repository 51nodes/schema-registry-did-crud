export class InvalidInput extends Error {
    constructor(msg: string) {
        super('Invalid Input: ' + msg);
    }
}
