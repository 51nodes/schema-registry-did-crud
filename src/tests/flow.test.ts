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

const validXsd = `<?xml version="1.0" encoding="UTF-8" ?>
  <xs:schema xmlns:xs="http://www.w3.org/2001/XMLSchema">
  
  <xs:simpleType name="stringtype">
    <xs:restriction base="xs:string"/>
  </xs:simpleType>
  
  <xs:simpleType name="inttype">
    <xs:restriction base="xs:positiveInteger"/>
  </xs:simpleType>
  
  <xs:simpleType name="dectype">
    <xs:restriction base="xs:decimal"/>
  </xs:simpleType>
  
  <xs:simpleType name="orderidtype">
    <xs:restriction base="xs:string">
      <xs:pattern value="[0-9]{6}"/>
    </xs:restriction>
  </xs:simpleType>
  
  <xs:complexType name="shiptotype">
    <xs:sequence>
      <xs:element name="name" type="stringtype"/>
      <xs:element name="address" type="stringtype"/>
      <xs:element name="city" type="stringtype"/>
      <xs:element name="country" type="stringtype"/>
    </xs:sequence>
  </xs:complexType>
  
  <xs:complexType name="itemtype">
    <xs:sequence>
      <xs:element name="title" type="stringtype"/>
      <xs:element name="note" type="stringtype" minOccurs="0"/>
      <xs:element name="quantity" type="inttype"/>
      <xs:element name="price" type="dectype"/>
    </xs:sequence>
  </xs:complexType>
  
  <xs:complexType name="shipordertype">
    <xs:sequence>
      <xs:element name="orderperson" type="stringtype"/>
      <xs:element name="shipto" type="shiptotype"/>
      <xs:element name="item" maxOccurs="unbounded" type="itemtype"/>
    </xs:sequence>
    <xs:attribute name="orderid" type="orderidtype" use="required"/>
  </xs:complexType>
  
  <xs:element name="shiporder" type="shipordertype"/>
  
  </xs:schema>`;

describe('Test flow with mocked Evan ipfs', () => {
  const validDid = 'did:schema:evan-ipfs:json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';

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

  it('should get undefined', async () => {
    jest.spyOn(evanIpfsService, 'getSchemaFromEvanIpfs').mockReturnValue(undefined);
    expect(await getSchema(validDid)).toBeUndefined();
  });

});

describe('Test flow with mocked Public Ipfs', () => {
  const validDid = 'did:schema:public-ipfs:json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';

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

  it('should get undefined', async () => {
    jest.spyOn(publicIpfsService, 'getSchemaFromPublicIpfs').mockReturnValue(undefined);
    expect(await getSchema(validDid)).toBeUndefined();
  });

});

describe('Test all possible variation of getSchema ', () => {
  const validDidWithJsonSchemaHint = 'did:schema:public-ipfs:json-schema:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';
  const validDidWithXsdHint = 'did:schema:public-ipfs:xsd:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';
  const validDidWithoutHint = 'did:schema:public-ipfs:QmNLei78zWmzUdbeRB3CiUfAizWUrbeeZh5K1rhAQKCh51';

  it('should get the registered json schema', async () => {
    jest.spyOn(publicIpfsService, 'getSchemaFromPublicIpfs').mockReturnValue(Promise.resolve(validJsonSchema));
    const schema = await getSchema(validDidWithJsonSchemaHint)
    expect(schema).toBe(validJsonSchema);
  });

  it('should get the registered xsd schema', async () => {
    jest.spyOn(publicIpfsService, 'getSchemaFromPublicIpfs').mockReturnValue(Promise.resolve(validXsd));
    const schema = await getSchema(validDidWithXsdHint)
    expect(schema).toBe(validXsd);
  });

  it('should get any schema cause no typehint', async () => {
    jest.spyOn(publicIpfsService, 'getSchemaFromPublicIpfs').mockReturnValue(Promise.resolve(validJsonSchema));
    const resultJsonSchema = await getSchema(validDidWithoutHint)
    expect(resultJsonSchema).toBe(validJsonSchema);
    jest.spyOn(publicIpfsService, 'getSchemaFromPublicIpfs').mockReturnValue(Promise.resolve(validXsd));
    const resultXsd = await getSchema(validDidWithoutHint)
    expect(resultXsd).toBe(validXsd);
  });

  it('should get undefined cause wrong typehint', async () => {
    jest.spyOn(publicIpfsService, 'getSchemaFromPublicIpfs').mockReturnValue(Promise.resolve(validJsonSchema));
    expect(await getSchema(validDidWithXsdHint)).toBeUndefined();

    jest.spyOn(publicIpfsService, 'getSchemaFromPublicIpfs').mockReturnValue(Promise.resolve(validXsd));
    expect(await getSchema(validDidWithJsonSchemaHint)).toBeUndefined();
  });

  it('should get undefined', async () => {
    jest.spyOn(publicIpfsService, 'getSchemaFromPublicIpfs').mockReturnValue(undefined);
    expect(await getSchema(validDidWithJsonSchemaHint)).toBeUndefined();
  });

});
