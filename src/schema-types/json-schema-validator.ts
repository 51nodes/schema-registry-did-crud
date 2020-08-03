import * as JsonSchema from '@hyperjump/json-schema';

export function validateJsonSchemaType(schemaContent: string): boolean {
  // just try to load the schema for validation, if it fails, consider invalid
  try {
    JsonSchema.add(JSON.parse(schemaContent));
    return true;
  } catch (error) {
    return false;
  }
}
