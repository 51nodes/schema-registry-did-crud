export enum SchemaType {
  JsonSchema = 'json-schema',
  Xsd = 'xsd',
}

export enum Network {
  EvanIpfs = 'evan-ipfs',
  PublicIpfs = 'public-ipfs',
}

export interface SchemaDid {
  did: string,
  method: string,
  network: Network,
  hint?: SchemaType,
  id:string
}

export interface ConfigObject {
  publicIpfsConfig?: PublicIpfsConfig;
  evanRuntimeConfig?: EvanRuntimeConfig;
}

export interface PublicIpfsConfig {
  nodeUrl: string,
  enablePin: boolean
}

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
