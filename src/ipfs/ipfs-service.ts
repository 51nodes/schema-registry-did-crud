import * as IpfsHttpClient from 'ipfs-http-client';
import {
  createDefaultRuntime,
  Ipfs,
  Runtime
} from '@evan.network/api-blockchain-core';
import { getConfig } from '../schema-registry';
import { Logger } from "tslog";

// tslint:disable: variable-name && no-var-requires
const Web3 = require('web3');
const BufferList = require('bl/BufferList')
// tslint:enable: variable-name && no-var-requires

const log: Logger = new Logger({ name: "Ipfs Service" });

async function addSchemaToPublicIPFS(schemaAsString: string): Promise<string> {
  const ipfs = await initPublicIpfs();
  const resultObject = await ipfs.add(schemaAsString);
  let ipfsHash: string;
  for await (const obj of resultObject) {
    ipfsHash = obj.path
    log.debug('ipfsHash: ' + ipfsHash);
  }
  const resultHash = Ipfs.ipfsHashToBytes32(ipfsHash);
  return resultHash;
}

async function getSchemaFromPublicIPFS(hash: string): Promise<string> {
  const ipfs = await initPublicIpfs();
  const cid = Ipfs.bytes32ToIpfsHash(hash);
  let schemaAsString: string;
  const chunks = []

  for await (const file of ipfs.get(cid)) {
    if (!file.content) continue;
    const content = new BufferList()
    for await (const chunk of file.content) {
      content.append(chunk)
    }
    schemaAsString = content.toString();
  }
  return schemaAsString;
}

async function addSchemaToEvanIPFS(schemaAsString: string): Promise<string> {
  const runtime = await initEvanRunTime();
  const resultHash = await runtime.dfs.add('schema.txt', Buffer.from(schemaAsString, 'utf-8'))
  const ipfsHash = Ipfs.bytes32ToIpfsHash(resultHash);
  log.debug('ipfsHash: ' + ipfsHash);
  return resultHash;
}

async function getSchemaFromEvanIPFS(hash: string): Promise<string> {
  const runtime = await initEvanRunTime();
  const fileBuffer = await runtime.dfs.get(hash);
  return fileBuffer.toString('utf-8');
}

async function initPublicIpfs() {
  const publicIpfsUrl = getConfig().publicIpfsUrl;
  return IpfsHttpClient(publicIpfsUrl);
}

async function initEvanRunTime(): Promise<Runtime> {
  const accountMap = getConfig().runtimeConfig.accountMap;
  const ipfs = getConfig().runtimeConfig.ipfs;
  const web3Provider = getConfig().runtimeConfig.web3Provider;
  const runtimeConfig = {
    accountMap,
    ipfs,
    web3Provider
  };
  const provider = new Web3.providers.WebsocketProvider(
    runtimeConfig.web3Provider, { clientConfig: { keepalive: true, keepaliveInterval: 5000 } });
  const web3 = new Web3(provider, null, { transactionConfirmationBlocks: 1 });
  const dfs = new Ipfs({ dfsConfig: runtimeConfig.ipfs });
  const runtime = await createDefaultRuntime(web3, dfs, { accountMap: runtimeConfig.accountMap });
  return runtime;
}

const ipfsService = {
  addSchemaToEvanIPFS, getSchemaFromEvanIPFS,
  addSchemaToPublicIPFS, getSchemaFromPublicIPFS
};

export default ipfsService;
