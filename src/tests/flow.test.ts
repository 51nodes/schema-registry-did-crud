import { registerSchema, getSchema, pinSchema, initLibrary } from '../schema-registry';
import { SchemaType, Network, ConfigObject } from '../model';
import publicIpfsService from '../ipfs/public-ipfs-service';
import evanIpfsService from '../ipfs/evan-ipfs-service';

const validJsonSchema = `{
    "$schema": "http://json-schema.org/draft-07/schema#",
    "$id": "http://example.com/product.schema.json",
    "title": "Product",
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
      },
      "tags": {
        "description": "Tags for the product",
        "type": "array",
        "items": {
          "type": "string"
        },
        "minItems": 1,
        "uniqueItems": true
      }
    },
    "required": [ "productId", "productName", "price" ]
  }`;

describe('Test flow with mocked Evan ipfs', () => {
  const validDid = 'did:schema:evan-ipfs:type-hint=json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';

  it('should register the validJsonSchema', async () => {
    jest.spyOn(evanIpfsService, 'addSchemaToEvanIpfs').mockReturnValue(Promise.resolve('QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'));
    const did = await registerSchema(validJsonSchema, SchemaType.JsonSchema, Network.EvanIpfs);
    expect(did).toBe(validDid);
  });

  it('should get the registierd schema', async () => {
    jest.spyOn(evanIpfsService, 'getSchemaFromEvanIpfs').mockReturnValue(Promise.resolve(validJsonSchema));
    const schema = await getSchema(validDid)
    expect(schema).toBe(validJsonSchema);
  });

});

describe('Test flow with mocked Public Ipfs', () => {
  const validDid = 'did:schema:public-ipfs:type-hint=json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';

  it('should register the validJsonSchema', async () => {
    jest.spyOn(publicIpfsService, 'addSchemaToPublicIpfs').mockReturnValue(Promise.resolve('QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51'));
    const did = await registerSchema(validJsonSchema, SchemaType.JsonSchema, Network.PublicIpfs);
    expect(did).toBe(validDid);
  });

  it('should get the registierd schema', async () => {
    jest.spyOn(publicIpfsService, 'getSchemaFromPublicIpfs').mockReturnValue(Promise.resolve(validJsonSchema));
    const schema = await getSchema(validDid)
    expect(schema).toBe(validJsonSchema);
  });

});

describe('Test flow pinning Ipfs', () => {
  it('should throw an error cause enablePin is false', async () => {
    const configObject: ConfigObject = {
      publicIpfsConfig: {
        nodeUrl: 'mockedUrl',
        enablePin: false
      }
    }
    initLibrary(configObject);
    const validDid = 'did:schema:public-ipfs:type-hint=json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';
    expect(async () =>
      await pinSchema(validDid)
    ).rejects.toEqual(new Error('Pinning is not enabled!'));
  });

  it('should throw an error cause enablePin in public config is undefined', async () => {
    const validDid = 'did:schema:public-ipfs:type-hint=json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';
    expect(async () =>
      await pinSchema(validDid)
    ).rejects.toEqual(new Error('Pinning is not enabled!'));
  });

  it('should throw an error cause enablePin in evan config is undefined', async () => {
    const validDid = 'did:schema:evan-ipfs:type-hint=json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';
    expect(async () =>
      await pinSchema(validDid)
    ).rejects.toEqual(new Error('Pinning is not enabled!'));
  });

  it('should pin schema on public ipfs', async () => {
    const validDid = 'did:schema:public-ipfs:type-hint=json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';
    jest.spyOn(publicIpfsService, 'validatePinEnabledOnPublicIpfs').mockReturnValue(true);
    jest.spyOn(publicIpfsService, 'pinSchemaInPublicIpfs').mockReturnValue(Promise.resolve(true));
    const result = await pinSchema(validDid);
    expect(result).toBe(true);
  });

  it('should pin schema on evan ipfs', async () => {
    const validDid = 'did:schema:evan-ipfs:type-hint=json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';
    jest.spyOn(evanIpfsService, 'validatePinEnabledOnEvanIpfs').mockReturnValue(true);
    jest.spyOn(evanIpfsService, 'pinSchemaInEvanIpfs').mockReturnValue(Promise.resolve(true));
    const result = await pinSchema(validDid);
    expect(result).toBe(true);
  });

});


