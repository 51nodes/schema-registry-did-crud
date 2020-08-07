import { SchemaType, Network } from './model';
import { validateJsonSchemaType } from './schema-types/json-schema-validator';
import { validateXsdSchemaType } from './schema-types/xsd-validator';
import { addSchemaToEvanIPFS, addSchemaToPublicIPFS, getSchemaFromEvanIPFS, getSchemaFromPublicIPFS } from './ipfs/ipfs-service';

export function validateSchemaType(schemaContent: any, schemaType: SchemaType): boolean {
  switch (schemaType) {
    case SchemaType.JsonSchema: {
      return validateJsonSchemaType(schemaContent);
    }
    case SchemaType.Xsd: {
      return validateXsdSchemaType(schemaContent);
    }
    default: {
      return false;
    }
  }
}

export async function registerSchema(schemaContent: any, schemaType: SchemaType, network: Network): Promise<string> {
  validateSchemaType(schemaContent, schemaType);
  let did = 'did:schema:' + network.toString() + ':' + 'type-hint=' + schemaType.toString();
  let ipfsHash: string;
  switch (network) {
    case Network.PublicIpfs: {
      ipfsHash = await addSchemaToPublicIPFS(schemaContent);
      break;
    }
    case Network.EvanIpfs: {
      ipfsHash = await addSchemaToEvanIPFS(schemaContent);
      break;
    }
    default: {
      return '';
    }
  }
  return did += ipfsHash;
}

export async function getSchema(did: string): Promise<string> {
  // TODO check if valid did
  let schemaAsString: string;
  const hash = did.substr(did.length - 66);
  if (did.toLowerCase().includes(Network.EvanIpfs)) {
    schemaAsString = await getSchemaFromEvanIPFS(hash);
  } else if (did.toLowerCase().includes(Network.PublicIpfs)) {
    schemaAsString = await getSchemaFromPublicIPFS(hash);
  } else {
    schemaAsString = 'No Schema!';
  }
  return schemaAsString;
}
