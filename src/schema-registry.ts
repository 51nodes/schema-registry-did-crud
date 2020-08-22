import { SchemaType, Network, ConfigObject } from './model';
import { validateSchemaDid, parseSchemaDid } from './did/did-utils';
import { validateSchemaType } from './schema-types/schema-validator';
import evanIpfsService from './ipfs/evan-ipfs-service';
import publicIpfsService from './ipfs/public-ipfs-service';
import { InvalidInput } from './exceptions/invalid-input.exception';

let configuration: ConfigObject = {};

export function initLibrary(initObject: ConfigObject) {
  configuration = initObject;
}

export function getConfig(): ConfigObject {
  return configuration;
}

export async function registerSchema(schemaContent: any, schemaType: SchemaType, network: Network): Promise<string> {
  if (!validateSchemaType(schemaContent, schemaType)) {
    throw new InvalidInput('Schema Type');
  }
  let did = 'did:schema:' + network.toString() + ':' + schemaType.toString() + ':';
  let ipfsHash: string;
  switch (network) {
    case Network.EvanIpfs: {
      ipfsHash = await evanIpfsService.addSchemaToEvanIpfs(schemaContent);
      break;
    }
    case Network.PublicIpfs: {
      ipfsHash = await publicIpfsService.addSchemaToPublicIpfs(schemaContent);
      break;
    }
  }
  return did += ipfsHash;
}

export async function getSchema(didAsString: string): Promise<string> {
  if (!validateSchemaDid(didAsString)) {
    throw new InvalidInput('DID');
  }
  let schemaAsString: string;
  const did = parseSchemaDid(didAsString);
  switch (did.network) {
    case Network.EvanIpfs:
      schemaAsString = await evanIpfsService.getSchemaFromEvanIpfs(did.id);
      break;
    case Network.PublicIpfs:
      schemaAsString = await publicIpfsService.getSchemaFromPublicIpfs(did.id);
      break;
  }
  if (!did.hint) {
    return schemaAsString;
  } else if (schemaAsString && validateSchemaType(schemaAsString, did.hint)) {
    return schemaAsString;
  }
  return;
}
