import { validateJsonSchemaType } from './json-schema-validator';
import { validateXsdSchemaType } from './xsd-validator';
import { SchemaType } from '../model';

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
