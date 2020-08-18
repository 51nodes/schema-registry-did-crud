import { registerSchema, getSchema } from '../schema-registry';
import { SchemaType, Network } from '../model';
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

  it('should get undefiend because of error', async () => {
    jest.spyOn(evanIpfsService, 'getSchemaFromEvanIpfs').mockRejectedValue(new Error('error'));
    expect(await getSchema(validDid)).toBeUndefined();
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

  it('should get undefiend because of error', async () => {
    jest.spyOn(publicIpfsService, 'getSchemaFromPublicIpfs').mockRejectedValue(new Error('error'));
    expect(await getSchema(validDid)).toBeUndefined();
  });

});
