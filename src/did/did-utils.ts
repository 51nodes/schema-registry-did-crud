import { SchemaDid, Network, SchemaType } from '../model';
import { InvalidInput } from '../exceptions/invalid-input.exception';

const didRegEx = /^did:schema:(evan-ipfs|public-ipfs):((json-schema|xsd):)?([0-9a-zA-Z._-]+)$/

/**
 * Validate whether the given DID complies to the schema DID method.
 * @param did the DID
 * @returns true if the given DID is a valid schema DID, false otherwise
 */
export function validateSchemaDid(did: string): boolean {
    return didRegEx.test(did);
}

/**
 * Parse the given DID into an object representation.
 * @param did the DID
 * @returns the object representation of the DID
 */
export function parseSchemaDid(did: string): SchemaDid {
    if (!validateSchemaDid(did)) {
        throw new InvalidInput('DID');
    }
    const parsedDidArray = did.match(didRegEx);
    const network: Network = parsedDidArray[1] as Network;
    const hash = parsedDidArray[4];
    const didObject: SchemaDid = {
        did: 'did',
        method: 'schema',
        network,
        hash
    };
    if (parsedDidArray[3]) {
        didObject.typeHint = parsedDidArray[3] as SchemaType;
    }
    return didObject;
}

/**
 * Create a DID from the given object representation.
 * @param didObject the object representation of the DID
 * @returns the DID string
 */
export function stringifySchemaDid(didObject: SchemaDid): string {
    return didObject.did + ':' + didObject.method + ':' + didObject.network + ':'
        + (didObject.typeHint ? didObject.typeHint + ':' : '') + didObject.hash;
}
