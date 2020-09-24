
import { Logger } from 'tslog';
import { exit } from 'process';
import {
  initLibrary, getConfig,
  registerSchema, getSchema,
  SchemaType, Network, ConfigObject
} from '../dist';

const log: Logger = new Logger({ name: 'example' });

const validJsonSchema = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "Item",
  "description": "A product from Acme's catalog",
  "type": "object",
  "properties": {
    "productId": {
      "description": "The unique identifier for a product",
      "type": "integer"
    },
    "productName": {
      "description": "Name of the product",
      "type": "string"
    },
    "price": {
      "description": "The price of the product",
      "type": "number",
      "exclusiveMinimum": 0
    }
  },
  "required": [ "productId", "productName", "price" ]
}`;

const configObject: ConfigObject = {
  publicIpfsConfig: {
    nodeUrl: 'https://ipfs.infura.io:5001/api/v0',
    enablePin: true
  },
  evanRuntimeConfig: {
    accountMap: {
      '0x8370F91b6Cdf7A15a7C48593c8Cba98C55B25e25': '50a635f2797d04e93c3c5d799099e42dbf116dcc04867ad6fbce83f1ec4cdfce',
    },
    ipfs: { host: 'ipfs.evan.network', port: '443', protocol: 'https' },
    web3Provider: 'wss://core.evan.network/ws',
    enablePin: true
  }
}

export async function addSchemaToIpfs(schemaAsString: string) {
  log.info('init Library');
  initLibrary(configObject);

  log.info('configration: ');
  log.info(getConfig());

  log.info('register schema in Evan IPFS');
  const exampleDidEvan = await registerSchema(schemaAsString, SchemaType.JsonSchema, Network.EvanIpfs);
  log.info('Evan IPFS DID: ' + exampleDidEvan);

  log.info('register schema in Public IPFS');
  const exampleDidPublic = await registerSchema(schemaAsString, SchemaType.JsonSchema, Network.PublicIpfs);
  log.info('Public IPFS DID: ' + exampleDidPublic);

  log.info('get schema under did:schema:evan-ipfs:json-schema:QmY8GAAJoffVZBH1JYvta2LRZxsPaUYVQ1FGTaxwK3vV7n');
  const exampleEvanSchema = await getSchema('did:schema:evan-ipfs:json-schema:QmY8GAAJoffVZBH1JYvta2LRZxsPaUYVQ1FGTaxwK3vV7n');
  log.info(exampleEvanSchema);

  log.info('get schema under did:schema:public-ipfs:json-schema:QmY8GAAJoffVZBH1JYvta2LRZxsPaUYVQ1FGTaxwK3vV7n');
  const examplePublicSchema = await getSchema('did:schema:public-ipfs:json-schema:QmY8GAAJoffVZBH1JYvta2LRZxsPaUYVQ1FGTaxwK3vV7n');
  log.info(examplePublicSchema);

  log.info('DONE!');
  exit(0);
}

addSchemaToIpfs(validJsonSchema);
