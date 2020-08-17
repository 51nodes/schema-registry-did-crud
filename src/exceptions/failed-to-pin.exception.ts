export class FailedToPin extends Error {
    constructor(msg: string) {
        super('Failed to Pin : ' + msg);
    }
}
