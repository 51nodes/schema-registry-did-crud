export enum SchemaType {
  JsonSchema = 'json-schema',
  Xsd = 'xsd',
}

export enum Network {
  EvanIpfs = 'evan-ipfs',
  PublicIpfs = 'public-ipfs',
}

export interface ConfigObject {
  publicIpfsUrl?: string;
  runtimeConfig?: EvanRunTimeConfig;
}

export interface EvanRunTimeConfig {
  accountMap: {
    [key: string]: any;
  }
  ipfs: {
    host: string;
    port: string;
    protocol: string;
  };
  web3Provider: string;
}
