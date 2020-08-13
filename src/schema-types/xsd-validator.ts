import { detectXmlSchema } from 'xsdlibrary';

export function validateXsdSchemaType(schemaContent: string): boolean {
  try {
    return detectXmlSchema(schemaContent) === 'xsd';
  } catch (_) {
    return false;
  }
}
