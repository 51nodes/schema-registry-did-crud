import * as IpfsHttpClient from 'ipfs-http-client';
import {
  createDefaultRuntime,
  Ipfs,
  Runtime
} from '@evan.network/api-blockchain-core';

const Web3 = require('web3');
const BufferList = require('bl/BufferList')

const publicIpfsUrl = 'https://ipfs.infura.io:5001/api/v0';

export async function addSchemaToPublicIPFS(schemaAsString: string): Promise<string> {
  const ipfs = IpfsHttpClient(publicIpfsUrl);
  const resultObject = await ipfs.add(schemaAsString);
  let ipfsHash: string;
  for await (const obj of resultObject) {
    ipfsHash = obj.path
    console.log('ipfsHash: ' + ipfsHash);
  }
  const resultHash = Ipfs.ipfsHashToBytes32(ipfsHash);
  return resultHash;
}

export async function addSchemaToEvanIPFS(schemaAsString: string): Promise<string> {
  const runtime = await initEvanRunTime();
  const resultHash = await runtime.dfs.add('schema.txt', Buffer.from(schemaAsString, 'utf-8'))
  const ipfsHash = Ipfs.bytes32ToIpfsHash(resultHash);
  console.log('ipfsHash: ' + ipfsHash);
  return resultHash;
}

export async function getSchemaFromPublicIPFS(hash: string): Promise<string> {
  const ipfs = IpfsHttpClient(publicIpfsUrl);
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

export async function getSchemaFromEvanIPFS(hash: string): Promise<string> {
  const runtime = await initEvanRunTime();
  const fileBuffer = await runtime.dfs.get(hash);
  return fileBuffer.toString('utf-8');
}

async function initEvanRunTime(): Promise<Runtime> {
  const runtimeConfig = {
    accountMap: {
      '0x8370F91b6Cdf7A15a7C48593c8Cba98C55B25e25': '50a635f2797d04e93c3c5d799099e42dbf116dcc04867ad6fbce83f1ec4cdfce',
    },
    ipfs: { host: 'ipfs.evan.network', port: '443', protocol: 'https' },
    web3Provider: 'wss://core.evan.network/ws',
  };
  const provider = new Web3.providers.WebsocketProvider(
    runtimeConfig.web3Provider, { clientConfig: { keepalive: true, keepaliveInterval: 5000 } });
  const web3 = new Web3(provider, null, { transactionConfirmationBlocks: 1 });
  const dfs = new Ipfs({ dfsConfig: runtimeConfig.ipfs });
  const runtime = await createDefaultRuntime(web3, dfs, { accountMap: runtimeConfig.accountMap });
  return runtime;
}
