import { SchemaType, Network } from './model';
import { validateJsonSchemaType } from './schema-types/json-schema-validator';
import { validateXsdSchemaType } from './schema-types/xsd-validator';

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

export function registerSchema(schemaContent: any, schemaType: SchemaType, network: Network): string {
  validateSchemaType(schemaContent, schemaType);
  return 'did';
}
