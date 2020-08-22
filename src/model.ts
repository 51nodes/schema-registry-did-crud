/**
 * Enumeration for supported schema types.
 */
export enum SchemaType {
  JsonSchema = 'json-schema',
  Xsd = 'xsd',
}

/**
 * Enumeration for supported storage networks.
 */
export enum Network {
  EvanIpfs = 'evan-ipfs',
  PublicIpfs = 'public-ipfs',
}

/**
 * Object representation of a schema DID.
 */
export interface SchemaDid {
  did: string,
  method: string,
  network: Network,
  typeHint?: SchemaType,
  hash:string
}

/**
 * Object representation of all configuration data.
 */
export interface ConfigObject {
  publicIpfsConfig?: PublicIpfsConfig;
  evanRuntimeConfig?: EvanRuntimeConfig;
}

/**
 * Configuration properties related to public IPFS.
 */
export interface PublicIpfsConfig {
  nodeUrl: string,
  enablePin: boolean
}

/**
 * Configuration properties related to Evan IPFS.
 */
export interface EvanRuntimeConfig  {
  accountMap: {
    [key: string]: any;
  }
  ipfs: {
    host: string;
    port: string;
    protocol: string;
  };
  web3Provider: string;
  enablePin: boolean;
}
