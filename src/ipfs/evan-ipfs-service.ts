import {
  createDefaultRuntime,
  Ipfs,
  Runtime
} from '@evan.network/api-blockchain-core';
import { getConfig } from '../schema-registry';
import { Logger } from 'tslog';

// tslint:disable: variable-name && no-var-requires
const Web3 = require('web3');
// tslint:enable: variable-name && no-var-requires

const log: Logger = new Logger({ name: 'Evan Ipfs Service' });

async function addSchemaToEvanIPFS(schemaAsString: string): Promise<string> {
  const runtime = await initEvanRunTime();
  log.debug(`Add schema to evan ipfs: ${schemaAsString}` );
  const resultByte32 = await runtime.dfs.add('schema.txt', Buffer.from(schemaAsString, 'utf-8'))
  const ipfsHash = Ipfs.bytes32ToIpfsHash(resultByte32);
  log.debug(`IpfsHash: ${ipfsHash}`);
  return ipfsHash;
}

async function getSchemaFromEvanIPFS(ipfsHash: string): Promise<string> {
  const runtime = await initEvanRunTime();
  log.debug(`Get schema from evan ipfs with IpfsHash: ${ipfsHash}`);
  const fileBuffer = await runtime.dfs.get(ipfsHash);
  const schema = fileBuffer.toString()
  log.debug(`Schema: ${schema}`);
  return schema;
}

async function initEvanRunTime(): Promise<Runtime> {
  log.debug('Init evan runtime');
  const accountMap = getConfig().evanRuntimeConfig.accountMap;
  const ipfs = getConfig().evanRuntimeConfig.ipfs;
  const web3Provider = getConfig().evanRuntimeConfig.web3Provider;
  const evanRuntimeConfig = {
    accountMap,
    ipfs,
    web3Provider
  };
  log.debug(`evanRuntimeConfig: `);
  log.debug(evanRuntimeConfig)
  const provider = new Web3.providers.WebsocketProvider(
    evanRuntimeConfig.web3Provider, { clientConfig: { keepalive: true, keepaliveInterval: 5000 } });
  const web3 = new Web3(provider, null, { transactionConfirmationBlocks: 1 });
  const dfs = new Ipfs({ dfsConfig: evanRuntimeConfig.ipfs });
  const runtime = await createDefaultRuntime(web3, dfs, { accountMap: evanRuntimeConfig.accountMap });
  return runtime;
}

const evanIpfsService = {
  addSchemaToEvanIPFS, getSchemaFromEvanIPFS
};

export default evanIpfsService;
