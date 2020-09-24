import * as Validator from '@exodus/schemasafe';

export function validateJsonSchemaType(schemaContent: string): boolean {
  // just try to load the schema for validation, if it fails, consider invalid
  try {
    Validator.validator(JSON.parse(schemaContent));
    return true;
  } catch (error) {
    return false;
  }
}
