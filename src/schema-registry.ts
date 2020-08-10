import { SchemaType, Network, ConfigObject } from './model';
import ipfsService from './ipfs/ipfs-service';
import { validateDid } from './did/did-validator';
import { validateSchemaType } from './schema-types/schema-validator';

let configuration: ConfigObject = {};

export function initLibrary(initObject: ConfigObject) {
  configuration = initObject;
}

export function getConfig(): ConfigObject {
  return configuration;
}

export async function registerSchema(schemaContent: any, schemaType: SchemaType, network: Network): Promise<string> {
  validateSchemaType(schemaContent, schemaType);
  let did = 'did:schema:' + network.toString() + ':' + 'type-hint=' + schemaType.toString() + ':';
  let ipfsHash: string;
  switch (network) {
    case Network.EvanIpfs: {
      ipfsHash = await ipfsService.addSchemaToEvanIPFS(schemaContent);
      break;
    }
    case Network.PublicIpfs: {
      ipfsHash = await ipfsService.addSchemaToPublicIPFS(schemaContent);
      break;
    }
    default: {
      return '';
    }
  }
  return did += ipfsHash;
}

export async function getSchema(did: string): Promise<string> {
  if (!validateDid(did)) {
    return 'Not a valid DID';
  }
  let schemaAsString: string;
  const hash = did.substr(did.length - 66);
  if (did.toLowerCase().includes(Network.EvanIpfs)) {
    schemaAsString = await ipfsService.getSchemaFromEvanIPFS(hash);
  } else if (did.toLowerCase().includes(Network.PublicIpfs)) {
    schemaAsString = await ipfsService.getSchemaFromPublicIPFS(hash);
  }
  return schemaAsString;
}
