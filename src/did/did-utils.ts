import { SchemaDid, Network, SchemaType } from "../model";
import { InvalidInput } from "../exceptions/invalid-input.exception";

const didRegEx = /^did:schema:(evan-ipfs|public-ipfs):(type-hint=(json-schema|xsd):)?([0-9a-zA-Z]*)$/

export function validateDid(did: string): boolean {
    return didRegEx.test(did);
}

export function parseSchemaDid(didAsString: string): SchemaDid {
    if (!validateDid(didAsString)) {
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
        const hintKey = 'hint'
        didObject[hintKey] = parsedDidArray[3] as SchemaType;
    }
    return didObject;
}

export function stringifySchemaDid(didObject: SchemaDid): string {
    return didObject.did + ':' + didObject.method + ':' + didObject.network + ':'
        + (didObject.hint ? 'type-hint=' + didObject.hint + ':' : '') + didObject.id;
}
