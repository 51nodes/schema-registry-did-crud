import { registerSchema, getSchema } from "../schema-registry";
import { SchemaType, Network } from "../model";
import ipfsFunctions from "../ipfs/ipfs-service";

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
  const validDid = 'did:schema:evan-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c';

  it('should register the validJsonSchema', async () => {
    jest.spyOn(ipfsFunctions, 'addSchemaToEvanIPFS').mockReturnValue(Promise.resolve('0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c'));
    const did = await registerSchema(validJsonSchema, SchemaType.JsonSchema, Network.EvanIpfs);
    expect(did).toBe(validDid);
  });

  it('should get the registierd schema', async () => {
    jest.spyOn(ipfsFunctions, 'getSchemaFromEvanIPFS').mockReturnValue(Promise.resolve(validJsonSchema));
    const schema = await getSchema(validDid)
    expect(schema).toBe(validJsonSchema);
  });

});

describe('Test flow  with mocked Publc Ipfs', () => {
  const validDid = 'did:schema:public-ipfs:type-hint=json-schema:0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c';

  it('should register the validJsonSchema', async () => {
    jest.spyOn(ipfsFunctions, 'addSchemaToPublicIPFS').mockReturnValue(Promise.resolve('0xa937ea507c396d8d417be352825c65f5fdf1e6fb60e8368db03f2cccda05567c'));
    const did = await registerSchema(validJsonSchema, SchemaType.JsonSchema, Network.PublicIpfs);
    expect(did).toBe(validDid);
  });

  it('should get the registierd schema', async () => {
    jest.spyOn(ipfsFunctions, 'getSchemaFromPublicIPFS').mockReturnValue(Promise.resolve(validJsonSchema));
    const schema = await getSchema(validDid)
    expect(schema).toBe(validJsonSchema);
  });

});
