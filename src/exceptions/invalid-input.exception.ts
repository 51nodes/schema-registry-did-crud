export class InvalidInput extends Error {
    constructor(msg: string) {
        super('Error Invalid Input: ' + msg);
    }
}
