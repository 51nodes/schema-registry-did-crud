import { SchemaType, Network } from './model';
import { validateJsonSchemaType } from './schema-types/json-schema-validator';

export function validateSchemaType(schemaContent: any, schemaType: SchemaType): boolean {
    switch (schemaType) {
        case SchemaType.JsonSchema: {
            return validateJsonSchemaType(schemaContent);
        }
    }
}

export function registerSchema(schemaContent: any, schemaType: SchemaType, network: Network): string {
  validateSchemaType(schemaContent, schemaType);
  return 'did';
}
