import { validateSchemaType } from '../index';
import { SchemaType } from '../model';

test('Single String Json Schema returns false', () => {
    const validationResult = validateSchemaType('23dlas$%LR"LKFGSDFGA', SchemaType.JsonSchema);
    expect(validationResult).toBe(false);
});

test('Wrong Json Schema object returns false', () => {
    const invalidJson = `{
        "schema": "test",
        "version": 123
    }`
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