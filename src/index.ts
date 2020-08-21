export { initLibrary, getConfig, registerSchema, getSchema } from './schema-registry';
export { SchemaType, Network, ConfigObject } from './model';
export { InvalidInput } from './exceptions/invalid-input.exception';
export { FailedToPin } from './exceptions/failed-to-pin.exception';
export { parseSchemaDid, stringifySchemaDid} from './did/did-utils'
