import { SchemaType } from '../model';
import { validateSchemaType } from '../schema-types/schema-validator';

test('Single String Json Schema returns false', () => {
  const validationResult = validateSchemaType('23dlas$%LR"LKFGSDFGA', SchemaType.JsonSchema);
  expect(validationResult).toBe(false);
});

test('Wrong Json Schema object returns false', () => {
  const invalidJson = `{
        "schema": "test",
        "version": 123
    }`;
  const validationResult = validateSchemaType(invalidJson, SchemaType.JsonSchema);
  expect(validationResult).toBe(false);
});

test('Valid Json Schema returns true', () => {
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
  const validationResult = validateSchemaType(validJsonSchema, SchemaType.JsonSchema);
  expect(validationResult).toBe(true);
});

test('Valid Json Schema without $id returns true', () => {
  const validJsonSchema = `{
        "$schema": "http://json-schema.org/draft-07/schema#",
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
  const validationResult = validateSchemaType(validJsonSchema, SchemaType.JsonSchema);
  expect(validationResult).toBe(true);
});

test('Single String XSD returns false', () => {
  const validationResult = validateSchemaType('NoXsd', SchemaType.Xsd);
  expect(validationResult).toBe(false);
});

test('Plain XML instead of XSD returns false', () => {
  const plainXml = `<start>
        <nested>someText</nested>
    </start>`;
  const validationResult = validateSchemaType(plainXml, SchemaType.Xsd);
  expect(validationResult).toBe(false);
});

test('Valid XSD returns true', () => {
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
  const validationResult = validateSchemaType(validXsd, SchemaType.Xsd);
  expect(validationResult).toBe(true);
});
