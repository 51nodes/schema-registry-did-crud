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

/**
 * Stores a schema to the given network after validating the schema type.
 * 
 * @param schemaContent the stringified schema
 * @param schemaType the type of the schema
 * @param network the network to be used for storing the schema
 * @returns the DID of the schema
 * @throws if the given schema content does not correspond to the type
 */
export async function registerSchema(schemaContent: string, schemaType: SchemaType, network: Network): Promise<string> {
  if (!validateSchemaType(schemaContent, schemaType)) {
    throw new InvalidInput('Schema Type');
  }
  let did = 'did:schema:' + network.toString() + ':' + schemaType.toString() + ':';
  let schemaHash: string;
  switch (network) {
    case Network.EvanIpfs: {
      schemaHash = await evanIpfsService.addSchemaToEvanIpfs(schemaContent);
      break;
    }
    case Network.PublicIpfs: {
      schemaHash = await publicIpfsService.addSchemaToPublicIpfs(schemaContent);
      break;
    }
  }
  return did += schemaHash;
}

/**
 * Get the schema for the given DID if it exists.
 * 
 * @param did the DID of the schema
 * @returns the schema content, undefined if not found or schema type validation fails
 * @throws if the given DID does not comply to the schema DID method
 */
export async function getSchema(did: string): Promise<string> {
  if (!validateSchemaDid(did)) {
    throw new InvalidInput('DID');
  }
  let schemaAsString: string;
  const didObject = parseSchemaDid(did);
  switch (didObject.network) {
    case Network.EvanIpfs:
      schemaAsString = await evanIpfsService.getSchemaFromEvanIpfs(didObject.hash);
      break;
    case Network.PublicIpfs:
      schemaAsString = await publicIpfsService.getSchemaFromPublicIpfs(didObject.hash);
      break;
  }
  if (!didObject.typeHint) {
    return schemaAsString;
  } else if (schemaAsString && validateSchemaType(schemaAsString, didObject.typeHint)) {
    return schemaAsString;
  }
  return;
}
