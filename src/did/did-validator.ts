
const didRegEx = /^did:schema:(evan-ipfs|public-ipfs):(type-hint=(json-schema|xmd):)?(0x[0-9a-fA-F]{64})$/

export function validateDid(did: string): boolean {
    return didRegEx.test(did);
}
