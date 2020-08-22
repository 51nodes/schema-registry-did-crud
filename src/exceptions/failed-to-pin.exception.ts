/**
 * Error thrown when pinning fails in an IPFS related storage network.
 */
export class FailedToPin extends Error {
    constructor(msg: string) {
        super('Failed to Pin : ' + msg);
    }
}
