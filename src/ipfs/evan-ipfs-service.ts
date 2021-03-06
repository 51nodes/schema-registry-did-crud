import {
  createDefaultRuntime,
  Ipfs,
  Runtime
} from '@evan.network/api-blockchain-core';
import { getConfig } from '../schema-registry';
import { Logger } from 'tslog';
import { FailedToPin } from '../exceptions/failed-to-pin.exception';

// tslint:disable: variable-name && no-var-requires
const Web3 = require('web3');
// tslint:enable: variable-name && no-var-requires

const log: Logger = new Logger({ name: 'Evan Ipfs Service' });

async function addSchemaToEvanIpfs(schemaAsString: string): Promise<string> {
  const runtime = await initEvanRunTime();
  log.debug(`Add schema to evan ipfs: ${schemaAsString}`);
  const resultByte32 = await runtime.dfs.add('schema.txt', Buffer.from(schemaAsString, 'utf-8'))
  const ipfsHash = Ipfs.bytes32ToIpfsHash(resultByte32);
  log.debug(`IpfsHash: ${ipfsHash}`);
  if (getConfig().evanRuntimeConfig?.enablePin) {
    log.debug(`Pin schema on public ipfs`);
    pinSchemaInEvanIpfs(ipfsHash, runtime);
    log.debug('Schema has been pinned');
  }
  return ipfsHash;
}

async function getSchemaFromEvanIpfs(ipfsHash: string): Promise<string> {
  const runtime = await initEvanRunTime();
  log.debug(`Get schema from evan ipfs with IpfsHash: ${ipfsHash}`);
  try {
    const fileBuffer = await runtime.dfs.get(ipfsHash);
    const schema = fileBuffer.toString()
    log.debug(`Schema: ${schema}`);
    return schema;
  } catch (error) {
    log.error(error.message);
    return;
  }
}

async function pinSchemaInEvanIpfs(ipfsHash: string, runtime: Runtime): Promise<void> {
  try {
    await runtime.ipld.ipfs.remoteNode.pin.add(ipfsHash);
  } catch (error) {
    log.error(error);
    throw new FailedToPin(error.message);
  }
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
  const provider = new Web3.providers.WebsocketProvider(
    evanRuntimeConfig.web3Provider, { clientConfig: { keepalive: true, keepaliveInterval: 5000 } });
  const web3 = new Web3(provider, null, { transactionConfirmationBlocks: 1 });
  const dfs = new Ipfs({ dfsConfig: evanRuntimeConfig.ipfs });
  const runtime = await createDefaultRuntime(web3, dfs, { accountMap: evanRuntimeConfig.accountMap });
  return runtime;
}

const evanIpfsService = {
  addSchemaToEvanIpfs, getSchemaFromEvanIpfs
};

export default evanIpfsService;
