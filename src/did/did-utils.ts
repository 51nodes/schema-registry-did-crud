import { SchemaDid, Network, SchemaType } from '../model';
import { InvalidInput } from '../exceptions/invalid-input.exception';

const didRegEx = /^did:schema:(evan-ipfs|public-ipfs):((json-schema|xsd):)?([0-9a-zA-Z._-]+)$/

export function validateSchemaDid(did: string): boolean {
    return didRegEx.test(did);
}

export function parseSchemaDid(didAsString: string): SchemaDid {
    if (!validateSchemaDid(didAsString)) {
        throw new InvalidInput('DID');
    }
    const parsedDidArray = didAsString.match(didRegEx);
    const network: Network = parsedDidArray[1] as Network;
    const hash = parsedDidArray[4];
    const didObject: SchemaDid = {
        did: 'did',
        method: 'schema',
        network,
        id: hash
    };
    if (parsedDidArray[3]) {
        didObject.hint = parsedDidArray[3] as SchemaType;
    }
    return didObject;
}

export function stringifySchemaDid(didObject: SchemaDid): string {
    return didObject.did + ':' + didObject.method + ':' + didObject.network + ':'
        + (didObject.hint ? didObject.hint + ':' : '') + didObject.id;
}
